import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import React from 'react'
import { GiMatchTip } from 'react-icons/gi'
import NavLink from './NavLink'

export default function TopNav(  ) {
  return (
    <div>
      <Navbar 
      className='bg-gradient-to-r from-purple-400 to-purple-700' 
      maxWidth='xl'
      classNames={{
        item:[
            'text-xl',
            'text-white',
            'uppercase',
            'data-[active=true] : text-yellow-200'
        ]
      }}>
        <NavbarBrand as={Link} href='/'>
            <GiMatchTip className='text-gray-200' size={40}/>
            <div className='font-bold text-3xl  flex' >
                  <span className='text-gray-900'>Next</span>
                  <span className='text-gray-200'>Match</span>             
            </div>
        </NavbarBrand>
        <NavbarContent justify='center'>
            <NavLink href='/matches' label='Matches'/>
            <NavLink href='/members' label='Members'/>
            <NavLink href='/lists' label='Lists'/>
            
        </NavbarContent>
        <NavbarContent justify='end'>
           
           <Button className='user-initial-act' variant="bordered"  as={Link} href='/login'> Login </Button>
           <Button className='user-initial-act' variant='bordered' as={Link} href='/register'> Register </Button>

        </NavbarContent>
      </Navbar>
    </div>
  )
}
