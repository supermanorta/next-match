'use server';

import { prisma } from "@/lib/prisma";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import bcrypt from 'bcryptjs';


export async function registerUser(data: RegisterSchema) {
    const validated = registerSchema.safeParse(data); 

    if(!validated.success){
        //throw a error to the server but not browswer so we need somethign else
        // throw new Error(validated.error.errors[0].message);
        return {error: validated.error.errors}
    }

    const {name, email,password} = validated.data;

    const hashedPassword = await bcrypt.hash(password,10);

    // do not let the same user sign up for more than one account via emails
    const existingUser = await prisma.user.findUnique({where: {email}});

    if(existingUser) return {error: 'User already exists'};

    return prisma.user.create({
        data:{
            name,
            email,
            passwordHash: hashedPassword
        }
    });

}