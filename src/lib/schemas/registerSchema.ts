import {z} from 'zod';


export const registerSchema= z.object( {
    name: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6)
});

export type RegisterSchema = z.infer<typeof registerSchema>