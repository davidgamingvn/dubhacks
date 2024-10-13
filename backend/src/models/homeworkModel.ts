import mongoose, { Schema, Document } from 'mongoose';

export interface IHomework extends Document {
  title: string;
  text: string;
  embedding: number[];
  userId: string;
}

const HomeworkSchema: Schema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  userId: { type: String, required: true}
});

export default mongoose.model<IHomework>('HomeworkIndex', HomeworkSchema);
