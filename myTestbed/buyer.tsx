import { DockDoor } from '@/app/actions/dbActions';
import { Stack, Card, Header, Title, Input, Text, Content, Button, List, Editable, EditableView, Icon, Switch } from '@localAPP/react';
import { Suspense, useState } from 'react';
import EditListEntry from './EditListEntry';
import { ListTypeA,ListTypeB } from '@/lib/types/CommonTypes';
//TODO: need to more this somewhere where we can call this globally for any edit items since its used in this class and editListEntry
const contentWidth = 482;

export type EditListMenuProps = {
    selectedListName: string;
    selectedListObject: ListTypeA;
    isNameEditable?: boolean;
    editListNameLabel?: string;
    buttonText?: string;
    listItems: ListTypeB;
    listTitle?: string;
    enabledSw?: string;
  };

  interface Email {
    id: number;
    subject: string;
    body: string;
    sender: string;
    timestamp: string;
  }
  
  interface EmailData {
    emails: Email[];
  }

// EditBDMexport default function EditBDM({ bdmList }: { bdmList: DockDoor[] }) {
export default function EditBDM({ 
        selectedListName,
        isNameEditable,
        buttonText,
        listTitle,
        selectedListObject,
        listItems,
    }: EditListMenuProps ) {
    // const [value, setName] = useState("");
    const [value, setValue] = useState('Description...');
    const emailDummyData = ({
        "emails": [
          {
            "id": 1,
            "subject": "Meeting Reminder",
            "body": "Don't forget our meeting tomorrow!",
            "sender": "noreply@example.com",
            "timestamp": "2025-05-30T10:00:00Z"
          },
          {
            "id": 2,
            "subject": "Welcome to Our Service",
            "body": "Welcome aboard! We're glad to have you.",
            "sender": "welcome@example.com",
            "timestamp": "2025-05-29T15:30:00Z"
          }
        ]
      } ) as EmailData;
      

    return(<>
          <Stack>
            <Card elevation='z2' w='530' h='1119' radius='sm' withShadow className='border-[1px] border-[#D8D9D9] border-solid px-[24px] py-[16px]'>
            <div className='self-stretch h-[52px] px-2 inline-flex justify-between items-center'>
                <Header className='p-0'>
                <Title fontWeight='medium' h='52' w={contentWidth} className="pt-2 justify-center text-black text-xl font-semibold font-['Open_Sans'] leading-7">
                    {/* TODO; Dynamic "Edit List", "Edit Door" ... */}
                    BDM Email Group
                </Title>
                </Header>
            </div>
            <div className='mt-2 mb-2'></div>
            <div className='pb-3'>
                <Text className="justify-center text-black text-sm font-bold font-['Open_Sans'] leading-7">BDM Code</Text>
                <Input
                readonly
                withoutMargin
                withFullWidth
                w={contentWidth}
                aria-label='Text Input'
                value={selectedListName.split("-")[0]}
                className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight'"
                sp={{
                    input: { background: "#EDEDED" },
                    "form-field": { background: "#EDEDED" },
                  }}
                ></Input>
            </div>
            <div className='pb-3'>
                <Text className="justify-center text-black text-sm font-bold font-['Open_Sans'] leading-7">BDM Name</Text>
                <Input
                readonly
                withoutMargin
                withFullWidth
                w={contentWidth}
                aria-label='Text Input'
                value={selectedListName.split("-")[1]}
                className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight'"
                sp={{
                    input: { background: "#EDEDED" },
                    "form-field": { background: "#EDEDED" },
                  }}
                ></Input>
            </div>
            <div className='pb-3'>
                <Text className="justify-center text-black text-sm font-bold font-['Open_Sans'] leading-7">BDM Description</Text>

             <Editable
                actionsPlacement={"center"}
                actionsPosition={"right"}
                className="flex p-0"
                color="danger" 
                se={{ border: '1px solid black'}}>
                <EditableView iconVisibility="always" 
                className="h-[40px] self-stretch  text-[14px] pl-[4px] font-['Open_Sans'] w-[480px] outline outline-1 outline-[#D8D9D9]"
                >
                    {value}
                </EditableView>
                <Input
                    withoutMargin
                    withFullWidth
                    slot="edit"
                    w={contentWidth}
                    aria-label='Text Input'
                    value=''
                    className="pl: 0 self-stretch justify-start text-sm font-normal rounded-sm font-['Open_Sans'] leading-tight'"> 
                    <Icon
                        slot="suffix"
                        name="pencil"
                        color="danger"
                        className="h-[24px] w-[24px]"
                    />   
                <Icon
              slot="suffix"
              name="delete"
             className="h-[24px] w-[24px]"
            />
                </Input> 
           </Editable>
          
        <List gap={0} className="max-h-[475px] 2xl:max-h-[800px]">
                  {emailDummyData.emails?.map((field, index) => (
                    <div
                      {...register(`selListItems.${index}.value` as const)}
                      className= "form-control flex flex-row items-center w-auto"                               
                      key={field.id}
                    >
                      {fields.length > 0 ? (
                        <Suspense>
                          <EditListEntry
                            listEntry={
                              getValues(`selListItems.${index}`) as ListTypeB[0]
                            }
                            index={index}
                            setValue={setValue}
                          ></EditListEntry>
                        </Suspense>
                      ) : (
                        <p>No Data</p>
                      )}
                    </div>
                  ))}
            </List>



            </div>
            {/* Main card content */}
            <Card w={contentWidth} h='907px' radius='sm'>
                <Content>
                <Stack direction='row'>
                    <Header w={contentWidth} className="font-['Open_Sans'] text-xl font-semibold pr-8">
                    <span className='w-[281px]'>List Values</span>
                    <div>
                        {
                        <Button
                            color='primary'
                            radius='lg'
                            rightIcon='plus'
                            className="justify-right font-['Open_Sans'] font-[800px] text-xs/3 whitespace-nowrap ml-4 pl-3 pr-3 pt-[6px] pb-[6px] text-[13px]"
                            filled>
                            Add Value
                        </Button>
                        }
                    </div>
                    </Header>
                </Stack>
                {/* List content */}
                {/* <List gap={0} maxh={'800'}>
                    {doorList.map((door, index) => (
                    <>
                        <div className={doorList.indexOf(door) % 2 == 0 ? 'bg-[#FAFAFA]' : ''}>
                        <Editable key={index}>
                            <EditableView
                            // We take indexOf(item) and mod by 2 so that we can alternate row colors.

                            iconVisibility='always'
                            className="text-[14px] font-['Open_Sans'] pl-4 pr-4 pt-3 pb-3 w-[382px]"
                            >
                            {door.des}
                            </EditableView>
                            <Input withoutMargin aria-label='Text Input' slot='edit'></Input>
                        </Editable>

                        {/* <Switch sp={doorList.indexOf(door) % 2 == 0 ? { host: { backgroundColor: '#FAFAFA' } } : {}}></Switch> */}
                        {/* </div> */}
                    {/* </> */}
                    {/* ))} */}
                {/* </List> */} 
                </Content>
            </Card>
            </Card>
      </Stack>
    </>);
}