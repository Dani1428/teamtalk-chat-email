import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  sender: mongoose.Types.ObjectId;
  channel: mongoose.Types.ObjectId;
  replyTo?: mongoose.Types.ObjectId;
  attachments?: string[];
  reactions: {
    emoji: string;
    users: mongoose.Types.ObjectId[];
  }[];
  isEdited: boolean;
  isPinned: boolean;
}

const MessageSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'video'],
    default: 'text',
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  attachments: [{
    type: String,
  }],
  reactions: [{
    emoji: String,
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  }],
  isEdited: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IMessage>('Message', MessageSchema);
