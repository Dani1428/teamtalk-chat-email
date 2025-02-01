import { Request, Response } from 'express';
import Call from '../models/Call';
import User from '../models/User';
import Channel from '../models/Channel';

export const initiateCall = async (req: Request, res: Response) => {
  try {
    const { channelId, receiverId, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    // Vérifier si l'utilisateur est dans le canal
    const channel = await Channel.findById(channelId);
    if (!channel || !channel.members.includes(userId)) {
      return res.status(403).json({
        message: 'Accès non autorisé à ce canal',
      });
    }

    // Vérifier si le destinataire est dans le canal
    if (!channel.members.includes(receiverId)) {
      return res.status(400).json({
        message: 'Le destinataire n\'est pas membre du canal',
      });
    }

    // Vérifier si un appel est déjà en cours
    const existingCall = await Call.findOne({
      channel: channelId,
      status: { $in: ['ringing', 'ongoing'] },
    });

    if (existingCall) {
      return res.status(400).json({
        message: 'Un appel est déjà en cours dans ce canal',
      });
    }

    // Créer l'appel
    const call = new Call({
      type,
      initiator: userId,
      receiver: receiverId,
      channel: channelId,
    });

    await call.save();

    res.status(201).json({
      message: 'Appel initié avec succès',
      call,
    });
  } catch (error) {
    console.error('Erreur lors de l\'initiation de l\'appel:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'initiation de l\'appel',
    });
  }
};

export const answerCall = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        message: 'Appel non trouvé',
      });
    }

    // Vérifier si l'utilisateur est le destinataire
    if (call.receiver.toString() !== userId) {
      return res.status(403).json({
        message: 'Seul le destinataire peut répondre à l\'appel',
      });
    }

    // Vérifier si l'appel est toujours en cours
    if (call.status !== 'ringing') {
      return res.status(400).json({
        message: 'L\'appel n\'est plus disponible',
      });
    }

    call.status = 'ongoing';
    await call.save();

    res.json({
      message: 'Appel accepté avec succès',
      call,
    });
  } catch (error) {
    console.error('Erreur lors de la réponse à l\'appel:', error);
    res.status(500).json({
      message: 'Erreur lors de la réponse à l\'appel',
    });
  }
};

export const endCall = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        message: 'Appel non trouvé',
      });
    }

    // Vérifier si l'utilisateur est participant à l'appel
    if (![call.initiator.toString(), call.receiver.toString()].includes(userId)) {
      return res.status(403).json({
        message: 'Non autorisé à terminer cet appel',
      });
    }

    call.status = 'ended';
    call.endTime = new Date();
    await call.save();

    res.json({
      message: 'Appel terminé avec succès',
      call,
    });
  } catch (error) {
    console.error('Erreur lors de la fin de l\'appel:', error);
    res.status(500).json({
      message: 'Erreur lors de la fin de l\'appel',
    });
  }
};

export const rejectCall = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Non autorisé',
      });
    }

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        message: 'Appel non trouvé',
      });
    }

    // Vérifier si l'utilisateur est le destinataire
    if (call.receiver.toString() !== userId) {
      return res.status(403).json({
        message: 'Seul le destinataire peut rejeter l\'appel',
      });
    }

    // Vérifier si l'appel est toujours en cours
    if (call.status !== 'ringing') {
      return res.status(400).json({
        message: 'L\'appel n\'est plus disponible',
      });
    }

    call.status = 'missed';
    call.endTime = new Date();
    await call.save();

    res.json({
      message: 'Appel rejeté avec succès',
      call,
    });
  } catch (error) {
    console.error('Erreur lors du rejet de l\'appel:', error);
    res.status(500).json({
      message: 'Erreur lors du rejet de l\'appel',
    });
  }
};
