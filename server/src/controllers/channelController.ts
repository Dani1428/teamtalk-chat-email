import { Request, Response } from 'express';
import Channel from '../models/Channel';
import User from '../models/User';
import Message from '../models/Message';

export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, description, type, members } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    // Créer le canal
    const channel = new Channel({
      name,
      description,
      type,
      members: [...members, userId],
      admins: [userId],
      createdBy: userId,
    });

    await channel.save();

    // Ajouter le canal aux utilisateurs
    await User.updateMany(
      { _id: { $in: [...members, userId] } },
      { $push: { channels: channel._id } }
    );

    res.status(201).json({
      message: 'Canal créé avec succès',
      channel,
    });
  } catch (error) {
    console.error('Erreur lors de la création du canal:', error);
    res.status(500).json({
      message: 'Erreur lors de la création du canal',
    });
  }
};

export const getChannels = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const channels = await Channel.find({
      $or: [
        { type: 'public' },
        { members: userId },
      ],
    })
      .populate('members', 'username status avatar')
      .populate('admins', 'username')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: { path: 'sender', select: 'username' },
      });

    res.json({
      channels,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des canaux',
    });
  }
};

export const getChannelMessages = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;
    const { page = 1, limit = 50 } = req.query;

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

    const messages = await Message.find({ channel: channelId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('sender', 'username avatar')
      .populate('replyTo');

    const total = await Message.countDocuments({ channel: channelId });

    res.json({
      messages,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des messages',
    });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { channelId, userId: memberIdToAdd } = req.params;
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

    // Vérifier si l'utilisateur est admin
    if (!channel.admins.includes(userId)) {
      return res.status(403).json({
        message: 'Seuls les administrateurs peuvent ajouter des membres',
      });
    }

    // Ajouter le membre
    if (!channel.members.includes(memberIdToAdd)) {
      channel.members.push(memberIdToAdd);
      await channel.save();

      // Ajouter le canal à l'utilisateur
      await User.findByIdAndUpdate(memberIdToAdd, {
        $push: { channels: channelId },
      });
    }

    res.json({
      message: 'Membre ajouté avec succès',
      channel,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout du membre',
    });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { channelId, userId: memberIdToRemove } = req.params;
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

    // Vérifier si l'utilisateur est admin
    if (!channel.admins.includes(userId)) {
      return res.status(403).json({
        message: 'Seuls les administrateurs peuvent retirer des membres',
      });
    }

    // Retirer le membre
    channel.members = channel.members.filter(
      id => id.toString() !== memberIdToRemove
    );
    await channel.save();

    // Retirer le canal de l'utilisateur
    await User.findByIdAndUpdate(memberIdToRemove, {
      $pull: { channels: channelId },
    });

    res.json({
      message: 'Membre retiré avec succès',
      channel,
    });
  } catch (error) {
    console.error('Erreur lors du retrait du membre:', error);
    res.status(500).json({
      message: 'Erreur lors du retrait du membre',
    });
  }
};
