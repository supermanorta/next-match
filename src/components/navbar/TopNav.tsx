import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import React from 'react'
import { GiMatchTip } from 'react-icons/gi'

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
            'uppercase'
        ]
      }}>
        <NavbarBrand>
            <GiMatchTip size={40}/>
            <div className='font-bold text-3xl flex'>
                <span>Next</span>
                <span>Match</span>
            </div>
        </NavbarBrand>
        <NavbarContent justify='center'>
            <NavbarItem as={Link} href='/members'>Matches</NavbarItem>
            <NavbarItem as={Link} href='/lists'>Matches</NavbarItem>
            <NavbarItem as={Link} href='/messages'>Matches</NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
           
           <Button className='user-initial-act' variant="bordered" > Login </Button>
           <Button className='user-initial-act' variant='bordered'> Register </Button>

        </NavbarContent>
      </Navbar>
    </div>
  )
}
