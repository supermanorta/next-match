import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import React from 'react'
import { GiMatchTip } from 'react-icons/gi'

export default function TopNav(  ) {
  return (
    <div>
      <Navbar>
        <NavbarBrand>
            <GiMatchTip size={40}/>
            <div>
                <span>Next</span>
                <span>Match</span>
            </div>
        </NavbarBrand>
        <NavbarContent justify='center'>
            Center
        </NavbarContent>
        <NavbarContent justify='end'>
            Right(end)
        </NavbarContent>
      </Navbar>
    </div>
  )
}
