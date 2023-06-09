export interface APIResponse{
  status: number;
  error?: any;
  data?: any;
}

export interface User{
  id: string
  fullName: string,
  phoneNumber: string,
  email: string,
  paid: boolean,
  regsiterationDate: Date
}

export interface  Slot {
  date: Date,
  totalSlots: number,
  availableSlots: number,
  users: User[]
}

export interface Workshop{
  id: string,
  name:String,
  description: string,
  longDescription: string,
  imgUrl: string,
  totalSlots: number,
  cost: number,
  location?: string,
  duration?: number
}

export interface WorkshopSlot{
  workshopId: string,
  workshopDate: Date,
  slot: Slot
}
