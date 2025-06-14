
'use client'
import { registerUser } from '@/app/actions/authActions';
import { RegisterSchema,registerSchema } from '@/lib/schemas/registerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi';

export default function RegisterForm() {
    const {register, handleSubmit,setError, formState:{errors, isValid} } = useForm<RegisterSchema>({
        // resolver: zodResolver(registerSchema),
        mode: 'onTouched'
    });
    const onSubmit = async (data:  RegisterSchema) => {
        const results = await registerUser(data);
        if(results.status == 'success'){
            console.log('User signed up');
        }else{
            if(Array.isArray(results.error)){
                results.error.forEach((e)=>{
                    const fieldName = e.path.join('.') as 'email' |'name'|'password';//the join helps us define this as a string
                    setError(fieldName,{message:e.message})
                })
            }else{
                setError('root.serverError', {message: results.error}); // root.serverError(property) is given to us by RHF for root=level errors out of the box. 

            }
        }
    }
  return (
    <Card className='w-2/5 mx-auto'>
        <CardHeader className='flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 items-center text-secondary'>
                <div className='flex flex-row items-center gap-3'>
                    <GiPadlock size={30}></GiPadlock>
                    <h1 className='text-3xl font-semibold'>Register</h1>
                </div>
                <p className='text-neutral-500'>Welcome back to Nextmatch</p>
            </div>
        </CardHeader>
        <CardBody>
            <form onSubmit={handleSubmit( onSubmit)}>
                <div className='space-y-4'>
                <Input 
                        defaultValue=''
                        label='Name'
                        variant='bordered'
                        {...register('name')}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}>
                    </Input>
                    <Input 
                        defaultValue=''
                        label='Email'
                        variant='bordered'
                        {...register('email')}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message }>
                    </Input>
                    < Input
                        defaultValue=''
                        label='Password'
                        variant='bordered'
                        type='password'
                        {...register('password')}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message }
                        >
                    </Input>  
                    {errors.root?.serverError && (<p className='text-danger text-sm'>{errors.root.serverError.message}</p>)}   
                    <Button isDisabled={!isValid} fullWidth color='secondary' type='submit'>
                        Register
                    </Button>            
                </div>
            </form>
        </CardBody>
    </Card>
  )
}
