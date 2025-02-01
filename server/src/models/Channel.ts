import mongoose, { Schema, Document } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  pinnedMessages: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
}

const ChannelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    default: 'public',
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  pinnedMessages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IChannel>('Channel', ChannelSchema);
