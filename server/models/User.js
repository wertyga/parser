import mongoose from 'mongoose';

const { Schema } = mongoose;
const UserModel = new Schema({
    cars: {
        type: Array
    },
    loaded: {
        cars: {
            type: Array
        }
    }
}, { timestamps: true });

export default mongoose.model('Users', UserModel);