import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fathername: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    photo: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    religion: { type: String, required: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    profession: { type: String },
    birthMark: { type: String },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] },
    signature: { type: String }
});

export default mongoose.model('Card', cardSchema);