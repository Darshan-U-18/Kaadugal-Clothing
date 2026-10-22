import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { isMongoConnected } from '../config/db';
import { loadStore, saveStore } from '../config/store';

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [AddressSchema],
    wishlist: [{ type: String }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);

export const UserService = {
  async findOneByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected) {
      return await UserModel.findOne({ email: cleanEmail });
    }
    const store = loadStore();
    return store.users.find((u) => u.email.toLowerCase() === cleanEmail);
  },

  async findById(id: string) {
    if (isMongoConnected && mongoose.isValidObjectId(id)) {
      return await UserModel.findById(id).select('-password');
    }
    const store = loadStore();
    const user = store.users.find((u) => u._id === id);
    if (user) {
      const { password, ...safe } = user;
      return safe;
    }
    return null;
  },

  async create(data: { name: string; email: string; password: string; role?: 'customer' | 'admin' }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const cleanEmail = data.email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = new UserModel({
        ...data,
        email: cleanEmail,
      });
      return await user.save();
    }

    const store = loadStore();
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: data.name,
      email: cleanEmail,
      password: hashedPassword,
      role: data.role || 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStore(store);
    const { password, ...safe } = newUser;
    return safe;
  },

  async updateById(id: string, updateData: any) {
    if (isMongoConnected && mongoose.isValidObjectId(id)) {
      return await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const store = loadStore();
    const idx = store.users.findIndex((u) => u._id === id);
    if (idx !== -1) {
      store.users[idx] = {
        ...store.users[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      saveStore(store);
      const { password, ...safe } = store.users[idx];
      return safe;
    }
    return null;
  },

  async comparePassword(candidate: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(candidate, hash);
  },
};
