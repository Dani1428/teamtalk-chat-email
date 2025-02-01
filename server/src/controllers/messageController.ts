import { Request, Response } from 'express';
import Message from '../models/Message';
import Channel from '../models/Channel';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const { content, type = 'text', replyTo, attachments } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        message: 'Canal non trouvé',
      });
    }

    // Vérifier l'accès au canal
    if (channel.type !== 'public' && !channel.members.includes(userId)) {
      return res.status(403).json({
        message: 'Accès non autorisé à ce canal',
      });
    }

    // Créer le message
    const message = new Message({
      content,
      type,
      sender: userId,
      channel: channelId,
      replyTo,
      attachments,
    });

    await message.save();

    // Ajouter le message au canal
    channel.messages.push(message._id);
    await channel.save();

    // Populate le message avec les informations du sender
    await message.populate('sender', 'username avatar');
    if (replyTo) {
      await message.populate('replyTo');
    }

    res.status(201).json({
      message: 'Message envoyé avec succès',
      data: message,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'envoi du message',
    });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        message: 'Message non trouvé',
      });
    }

    // Vérifier si l'utilisateur est l'auteur du message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        message: 'Seul l\'auteur peut modifier le message',
      });
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    await message.populate('sender', 'username avatar');
    if (message.replyTo) {
      await message.populate('replyTo');
    }

    res.json({
      message: 'Message modifié avec succès',
      data: message,
    });
  } catch (error) {
    console.error('Erreur lors de la modification du message:', error);
    res.status(500).json({
      message: 'Erreur lors de la modification du message',
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        message: 'Message non trouvé',
      });
    }

    // Vérifier si l'utilisateur est l'auteur du message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        message: 'Seul l\'auteur peut supprimer le message',
      });
    }

    // Supprimer le message du canal
    await Channel.findByIdAndUpdate(message.channel, {
      $pull: { messages: messageId, pinnedMessages: messageId },
    });

    await message.deleteOne();

    res.json({
      message: 'Message supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression du message',
    });
  }
};

export const togglePinMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        message: 'Message non trouvé',
      });
    }

    const channel = await Channel.findById(message.channel);
    if (!channel) {
      return res.status(404).json({
        message: 'Canal non trouvé',
      });
    }

    // Vérifier si l'utilisateur est admin du canal
    if (!channel.admins.includes(userId)) {
      return res.status(403).json({
        message: 'Seuls les administrateurs peuvent épingler des messages',
      });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    if (message.isPinned) {
      channel.pinnedMessages.push(message._id);
    } else {
      channel.pinnedMessages = channel.pinnedMessages.filter(
        id => id.toString() !== messageId
      );
    }
    await channel.save();

    res.json({
      message: `Message ${message.isPinned ? 'épinglé' : 'désépinglé'} avec succès`,
      data: message,
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut d\'épinglage:', error);
    res.status(500).json({
      message: 'Erreur lors du changement de statut d\'épinglage',
    });
  }
};

export const addReaction = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        message: 'Message non trouvé',
      });
    }

    // Trouver la réaction existante avec cet emoji
    let reaction = message.reactions.find(r => r.emoji === emoji);

    if (reaction) {
      // Vérifier si l'utilisateur a déjà réagi
      const userIndex = reaction.users.indexOf(userId);
      if (userIndex > -1) {
        // Retirer la réaction
        reaction.users.splice(userIndex, 1);
        if (reaction.users.length === 0) {
          // Supprimer la réaction si plus personne ne l'utilise
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        // Ajouter l'utilisateur à la réaction
        reaction.users.push(userId);
      }
    } else {
      // Créer une nouvelle réaction
      message.reactions.push({
        emoji,
        users: [userId],
      });
    }

    await message.save();
    await message.populate('reactions.users', 'username avatar');

    res.json({
      message: 'Réaction mise à jour avec succès',
      data: message,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réaction:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout de la réaction',
    });
  }
};
