'use server';

import { prisma } from "@/lib/prisma";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs';


export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
    try {
        const validated = registerSchema.safeParse(data); 
    
        if(!validated.success){
            //throw a error to the server but not browswer so we need somethign else
            // throw new Error(validated.error.errors[0].message);
            return { status:"error", error: validated.error.errors}
        }
        
        const {name, email,password} = validated.data;
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        // do not let the same user sign up for more than one account via emails
        const existingUser = await prisma.user.findUnique({where: {email}});
    
        if(existingUser) return { status:"error", error: 'User already exists'};
    
        const user = await prisma.user.create({
            data:{
                name,
                email,
                passwordHash: hashedPassword
            }
        });
        return { status:"success", data: user}
    } catch (error) {
        console.log(error);
        return{status:"error", error:'Something went wrong'};
    }


}