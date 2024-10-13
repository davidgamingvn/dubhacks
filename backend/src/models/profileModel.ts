import { Schema, model } from 'mongoose';

// Define the schema for subject ratings
const SubjectRatingsSchema = new Schema({
  math: { type: Number, min: 0, max: 100, required: true },
  science: { type: Number, min: 0, max: 100, required: true },
  history: { type: Number, min: 0, max: 100, required: true },
  english: { type: Number, min: 0, max: 100, required: true },
  art: { type: Number, min: 0, max: 100, required: true },
  physicalEducation: { type: Number, min: 0, max: 100, required: true },
  music: { type: Number, min: 0, max: 100, required: true },
  // Add more subjects as needed
});

// Define the schema for the constraints
const ConstraintSchema = new Schema({
  name: { type: String, required: true },
  days: {
    type: [Number],
    validate: {
      validator: function (v: number[]) {
        return v.every((day) => day >= 0 && day <= 6);
      },
      message: (props: any) => `${props.value} is not a valid day, must be between 0 and 6`,
    },
    required: true,
  },
  from: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Matches 24-hour format "HH:MM"
      },
      message: (props: any) => `${props.value} is not a valid time, must be in HH:MM 24-hour format`,
    },
    required: true,
  },
  to: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Matches 24-hour format "HH:MM"
      },
      message: (props: any) => `${props.value} is not a valid time, must be in HH:MM 24-hour format`,
    },
    required: true,
  }
});

// Define the main schema
const ProfileSchema = new Schema({
  name: { type: String, required: true },
  subjectRatings: { type: SubjectRatingsSchema, required: true },
  constraints: { type: [ConstraintSchema], required: true },
});

// Export the model
const Profile = model('Profile', ProfileSchema);

export default Profile;
