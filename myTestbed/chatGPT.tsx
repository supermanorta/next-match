import React from 'react'
import {Text} from "@mortar/react";
import { getBDMDefinition } from '@/app/actions/adminActions';
import { bdm_defn } from "@Prisma/client";
import { BDM_SOURCE } from '@/lib/constants';
import ListMenuWrapper, {ListTypeA, ListTypeB} from '@/components/admin/ListMenuWrapper';

export default async function BDMManagementPage() {
  const bdmListTable  = (await getBDMDefinition()) as bdm_defn[];
  //  const dbmList: bdm_defn | undefined  = (await getBDMDefinitons()) as bdm_defn[];

 const scrubBDMListTypeA = getTypeAListForBDM(bdmListTable);

const holdTypeB : ListTypeB = [{
  id: 0,
  value: '',
  keyId: 7,
  deptId: 7,
  source: 'BDM_SOURCE',
}];


  return (
    <>
        <Text className='custom-page-title '>BDM Management</Text>
        <ListMenuWrapper
           title="BDM List"
           buttonText="Add List"
           items={scrubBDMListTypeA}
           editTitle="Edit List"
           editButtonText="Add Value"
           editListNameLabel="BDM"
           editListItems={ holdTypeB }
           isNameEditable={true}
        />
    </>
  )
}

function getTypeAListForBDM( bdmListTable:bdm_defn[] ): ListTypeA[] {
  //Create the Type A list
//   const bdmListTypeA = bdmListTable.map( (bdm_obj) =>({
//     ...bdm_obj,
//     source: BDM_SOURCE
//   }));
//   // Filter that list and edit it so that it shows the content needed
//  return bdmListTypeA?.filter(bdm=> bdm.bdm_cd != '00').map((bdm)=>
//     ({
//       id: bdm.bdm_nm,
//       value: `${bdm.bdm_cd} - ${bdm.bdm_nm}`,
//       source: BDM_SOURCE,
//     }),


    return bdmListTable
            .filter(bdm=> bdm.bdm_cd !== '00')
            .map((bdm)=>({
                id: Number(bdm.bdm_cd),
                value: `${bdm.bdm_cd} - ${bdm.bdm_nm}`,
                source: BDM_SOURCE,
            })
            );
}
import  getTypeAListForBDM  from "@/app/admin/bdm-mgmt/page";
import { bdm_defn } from "@Prisma/client";


describe('test the filter in creating the TypeA List to be use in ListMenuWrapper', () =>{
    it("fitlers out BDM with a bdm_cd != 00",()=>{
        //Arrange
        const bdms = ([
            {bdm_cd: "00", bdm_nm: "SHOULDnotSEE", desc:'1' },
            {bdm_cd: "0", bdm_nm: "okToSee", desc: '2'},
            {bdm_cd: "1", bdm_nm: "seeMePlease", desc: '3'},
        ]) ;
        //ACT
        const outputOfFunciton = getTypeAListForBDM(bdms);
        console.log(outputOfFunciton);
        //ASSERT
        expect(outputOfFunciton).toHaveLength(2);
        expect(outputOfFunciton).toMatchObject({
            id: "seeMePlease", value: "1 - seeMePlease", source: 'bdm_defn'
        });
    })
} );