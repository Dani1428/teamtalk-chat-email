import mongoose, { Schema, Document } from 'mongoose';

export interface ICall extends Document {
  type: 'audio' | 'video';
  initiator: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  channel: mongoose.Types.ObjectId;
  status: 'ringing' | 'ongoing' | 'ended' | 'missed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

const CallSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true,
  },
  initiator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  status: {
    type: String,
    enum: ['ringing', 'ongoing', 'ended', 'missed'],
    default: 'ringing',
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Calculer la durée de l'appel avant de sauvegarder
CallSchema.pre('save', function(next) {
  if (this.status === 'ended' && this.endTime) {
    this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / 1000);
  }
  next();
});

export default mongoose.model<ICall>('Call', CallSchema);
