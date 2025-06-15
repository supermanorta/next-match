"use client";
import {
  addBuyerEmailToGroup,
  createDockDoorForLocation,
  createRejRsnVal,
  createRPCSizeDefn,
  createRPCTypeDefn,
  createSelListVal, createVendorEstNumber,
  upDateDoorDockName,
  upDateDoorDockUse,
  updateRejRsnVal,
  updateRPCSizeDefn,
  updateRPCTypeDefn,
  updateSelListVal,
  updateVendorEstNumber,
} from "@/app/actions/adminActions";
import { MteToastService } from "@appLocal/elements/atomic/toast";
import { RejectionReasons, SelectListValue } from "@/app/actions/dbActions";
import {Buyer_defn, Buyer_email_defn, dock_door_defn, rpc_sz_defn, rpc_type_defn, vend_estnbr_defn} from "@prisma/client";
import { ListValueSchema } from "@/lib/schemas/editList";
import {
  Editable,
  EditableView,
  Switch,
  Icon,
  Input,
  MteInput,
  TagList,
  Tag,
  Stack, Skeleton, Box,
} from "@appLocal/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ActionResult } from "@/types";
import {
  Buyer_SOURCE,
  DOCK_DOOR_SOURCE,
  REJN_RSN_SOURCE,
  RPC_SIZE_SOURCE,
  RPC_TYPE_SOURCE,
  SEL_LIST_SOURCE,
  VENDOR_EST_NUMBER_SOURCE,
} from "@/lib/constants";
import { Controller } from "react-hook-form";
import { BuyerEmailSchema } from "@/lib/schemas/validateEmail";

type ListTypeBValue = {
  id: number|string;
  value: string;
  keyId?: number| string;
  deptId: number;
  source: string;
  enabledSw?: string;
};

export default function EditListEntry({
  listEntry,
  index,
  setValue,
  removeItemFromForm,
  control,
  Buyer_Description,
}: {
  listEntry: ListTypeBValue;
  index: number;
  setValue: any;
  removeItemFromForm?: (index:number) => void;
  control?:any;
  Buyer_Description?: any;
}) {
  const inputRef = useRef<MteInput>(null);
  const pathname = usePathname();
  const isDoorMgmt = pathname == "/admin/door-mgmt";
  const isRPCMgmt = pathname == "/admin/rpc-mgmt";
  const isBuyerEdit = pathname == "/admin/Buyer-mgmt";
  const [name, setName] = useState("");
  const [switchStatus, setSwitchStatus] = useState<string>(
    listEntry.enabledSw as string,
  );
  const router = useRouter();
  let editableClassName = getEditableClassName();
  let inputClassName = getInputClassName();
  const [isLoading, setIsLoading] = useState(true);
  const [previousItemBeforeEdit,setPreviousItemBeforeEdit]= useState<string>(listEntry.value)

  const searchParams = useSearchParams()
 
  // const locIdURL  = searchParams.get('locId') ?? '999';
  const deptIdURL = searchParams.get('deptId')?? '999';
  

  useEffect(() => {
    setName(listEntry.value);
    setIsLoading(false);
  }, [listEntry]);

  function updateListItemSelected(neoListItemName:string) {
    if(neoListItemName != previousItemBeforeEdit){
      setPreviousItemBeforeEdit( neoListItemName );
    }
  }



  let RPCTag = <></>;

  if (isRPCMgmt) {
    RPCTag = generateRPCData();
  }
 
  return (
    <>
      {isLoading ? (
          <Box className="mt-1 mb-1">
          <Skeleton shape="rect" height="40" width="550"></Skeleton>
          </Box>
      ) : (
        <Stack
          direction="row"
          // Alternate row colors
          className={
            index % 2 == 0
              ? "flex h-[40px] w-auto bg-[#FAFAFA]"
              : "flex h-[40px]"
          }
        >
          {RPCTag}
          <Editable
            onSave={validateListItem}
            actionsPlacement={"center"}
            actionsPosition={"right"}
            className="flex p-0"
          >
            <EditableView iconVisibility="always" className={editableClassName}>
              {/* {value} */}
              <Controller name={`selListItems.${index}.value`} control={control} render={({field})=><span> {field.value} </span>}/>
            </EditableView>
            {/* Input Value is what will show up when you click the input to edit the field. */}
            <Controller name={`selListItems.${index}.value`} control={control} render={({field})=>(
              <Input
                maxlength="50"
                radius="sm"
                ref={inputRef}
                // placeholder={value}
                placeholder={field.value}
                // value={listEntry.value}
                onChange={ e => field.onChange(e.detail.value) }
                withoutMargin
                withFullWidth
                aria-label="Text Input"
                slot="edit"
                className={inputClassName}
              ></Input>
          )}/>
          </Editable>
          {/* Validate  which add on should be see dpending on page,Buyer or Door Management door toggles  */}
          { isBuyerEdit &&( 
            <Icon
              name="trash-can"
              color="primary"
              className="flex-1 pt-[3px] pb-[3px] pr-[5px] h-[5px] w-[5px]"
              />
            )
          }
          {isDoorMgmt && (
            <Switch
              className="flex-1 self-center justify-self-end pt-[13px] pb-[11px] pr-[15px] ml-[30px]"
              checked={switchStatus == "Y" ? true : false}
              onChange={isDoorActiveToggle}
              role="switch"
            ></Switch>
          )}
        </Stack>
      )}
    </>
  );

  async function saveEntryToDB() {
    setValue(`selListItems.${index}.value`, inputRef.current!.value);
    listEntry.value = inputRef.current!.value;
    setName(inputRef.current!.value);
    

    // New DB Value Flow
    if (listEntry.keyId == null) {
      let createValue;
      switch (listEntry.source) {
        case DOCK_DOOR_SOURCE:
          createValue = (await createDockDoorForLocation(
            listEntry.id as number,
            listEntry.value,
            "Y",
          )) ;
          if(!createValue || createValue.status==="error"){
            removeItemFromForm?.(index);
            createToast(`Error while creating '${listEntry.value}' its possiable this value already exist in the DB, see QIS Tech Team for inquery`, "danger");
            return;
          }
          listEntry.keyId = createValue.data.dock_door_id;
          setSwitchStatus("Y");
          break;
        case Buyer_SOURCE:
          // Buyer_cd:string, email_add: string, dept_id:number)
          createValue = (await scrubUserEmailInput(String(listEntry.id),inputRef.current!.value,listEntry.deptId) ) as ActionResult<Buyer_email_defn>;
;          break;
        case SEL_LIST_SOURCE:
          createValue = (await createSelListVal(
            listEntry.value,
            listEntry.id as number,
            listEntry.deptId,
          )) as SelectListValue;
          listEntry.keyId = createValue.sel_list_val_id;
          break;
        case REJN_RSN_SOURCE:
          createValue = (await createRejRsnVal(
            listEntry.value,
            listEntry.deptId,
          )) as RejectionReasons;
          listEntry.keyId = createValue.rejn_rsn_id;
          break;
        case RPC_TYPE_SOURCE:
          createValue = (await createRPCTypeDefn(
            listEntry.value,
          )) as ActionResult<rpc_type_defn>;

          if (createValue.status === "success") {
            listEntry.keyId = createValue.data.rpc_type_id;
          }
          break;
        case RPC_SIZE_SOURCE:
          createValue = (await createRPCSizeDefn(
            listEntry.value,
          )) as ActionResult<rpc_sz_defn>;

          if (createValue.status === "success") {
            listEntry.keyId = createValue.data.rpc_sz_id;
          }
          break;
        case VENDOR_EST_NUMBER_SOURCE:
          createValue = await createVendorEstNumber(
            listEntry.value,
            listEntry.id as number,
            listEntry.deptId,
          );
          if (createValue.status === "success") {
            listEntry.keyId = Number(createValue.data.vend_est_id);
          }
          break;
      }
      // @ts-ignore
      if (createValue?.status === "success") {
        createToast(`Successfully created '${listEntry.value}'`, "success");
      } else {
        createToast(`Error while creating '${listEntry.value}'`, "danger");
      }
    } else {
      // Determine which list the value belongs to and update it
      let updatedValue;

      switch (listEntry.source) {
        case REJN_RSN_SOURCE:
          updatedValue = await updateRejRsnVal(
            listEntry.value,
            listEntry.deptId,
            listEntry.keyId as number,
          );
          break;
        case SEL_LIST_SOURCE:
          updatedValue = await updateSelListVal(
            listEntry.value,
            listEntry.keyId as number,
          );
          break;
        case DOCK_DOOR_SOURCE:
          const dockDoorID = listEntry.keyId as number;
          const name = inputRef.current!.value;
          const locationID = listEntry.id as number;
         
          updatedValue = await upDateDoorDockName(name,locationID,dockDoorID );
          if(updatedValue.status === "error"){
            setValue(`selListItems.${index}.value`,  previousItemBeforeEdit);
            createToast(`Error while Updating '${listEntry.value}' to '${name}',  '${index}' its possiable this value already exist at this locaiton see QIS Tech Team for inquery`, "danger");
            return ;
          }
          break;

        case RPC_TYPE_SOURCE:
          updatedValue = await updateRPCTypeDefn(listEntry.id as number, listEntry.value);
          break;
        case RPC_SIZE_SOURCE:
          updatedValue = await updateRPCSizeDefn(listEntry.id as number, listEntry.value);
          break;
        case VENDOR_EST_NUMBER_SOURCE:
          updatedValue = await updateVendorEstNumber(
            listEntry.keyId as number,
            listEntry.value,
          );
          break;
        default:
          console.log(`Unknown source ${listEntry.source}`);
          break;
      }
      if (updatedValue) {
        createToast(`Successfully updated '${listEntry.value}'`, "success");
      } else {
        createToast(`Error while updating '${listEntry.value}'`, "danger");
      }
    }
    // Force refresh UI so the newly added list values are persistent.
    router.refresh();
    inputRef.current!.value = "";
  }

  function isDoorActiveToggle(event: any) {
    const toggleState: boolean = event.detail.checked;
    const dockDoorID = listEntry.keyId as number;
    try {
      if (toggleState == true) {
        upDateDoorDockUse(dockDoorID, "Y");
      } else if (toggleState == false) {
        upDateDoorDockUse(dockDoorID, "N");
      }
    } catch (oops) {
      console.error("Updated failed to complete ", oops);
    }
  }

  async function validateListItem() {
    const pendingListEntry = {
      id: listEntry.id,
      value: inputRef.current!.value,
      keyId: listEntry.keyId,
      deptId: listEntry.deptId,
      source: listEntry.source,
    };

    const isValidData = ListValueSchema.safeParse(pendingListEntry);
    if (!isValidData.success && pendingListEntry.source != Buyer_SOURCE) {
      createToast(isValidData.error.errors[0].message+"YOOO", "danger", 10000);
    } else {
      await saveEntryToDB();
    }
  }

  function generateRPCData() {
    let rpcColor = "";
    let rpcValue = "";
    let className =
      "ml-1 mr-3 outline outline-1 outline-offset-[-1px] outline-appLocal-Palette-Group-Status-Primary-Base-Color ";
    let rpcIcon = "";
    if (listEntry.source == "rpc_type_defn") {
      rpcValue = "Vendor";
      rpcColor = "success";
      rpcIcon = "store";
    } else {
      rpcValue = "Size";
      rpcColor = "primary";
      rpcIcon = "arrow-expand-all";
      className += " pr-8";
    }

    return (RPCTag = (
      <TagList>
        <Tag
          className={className}
          icon={rpcIcon}
          emphasized
          size={"lg"}
          /* @ts-ignore */
          color={rpcColor}
        >
          {rpcValue}
        </Tag>
      </TagList>
    ));
  }

  function getEditableClassName() {
    let editableClassName =
      "h-[40px] text-[14px] font-['Open_Sans'] pr-2 pt-[4px] pb-[4px] w-[440px] rounded-0";
    if (isDoorMgmt) {
      editableClassName =
        "h-[40px] text-[14px] pl-[4px] font-['Open_Sans'] w-[345px] rounded-0";
    }
    if (isRPCMgmt) {
      editableClassName =
        "h-[40px] text-[14px] font-['Open_Sans'] pl-0 ml-0 pl-1 pr-8 pt-[4px] pb-[4px] w-[350px] rounded-0";
    }
    return editableClassName;
  }

  function getInputClassName() {
    let inputClassName = "text-[14px] font-['Open_Sans'] pr-4 pt-0 pb-0 mr-6 w-[380px]";
    if (isDoorMgmt) {
      inputClassName =
        "text-[14px] font-['Open_Sans'] mr-20 pr-64 pt-[4px] pb-[4px] mr-6 w-[281px] flex-1 rounded-0";
    }
    if (isRPCMgmt) {
      inputClassName =
        "text-[14px] font-['Open_Sans'] ml-0 pl-1 pr-4 pt-1 pb-1 mr-6 rounded-0";
    }
    return inputClassName;
  }

  function createToast(message: string, status: string, duration?: number) {
    return MteToastService.show({
      message: message,
      closeLabel: "Close toast",
      // @ts-ignore
      status: status,
      duration: duration ? duration : 5000,
    });
  }

  async function scrubUserEmailInput(Buyer_cd:string, email_add: string, dept_id:number):Promise<ActionResult<Buyer_email_defn>  >{
    
    let BuyerCode = Buyer_cd; 
    let email_address = email_add; 
    let departmentID  = Number(dept_id);
    const emailValObj = {
      email: email_address,
      Buyer_code: BuyerCode,
      dept_id: deptIdURL,
    };
    let returtnBody:any;
    
    const isValidEmail = BuyerEmailSchema.safeParse(emailValObj);

   
    if(isValidEmail.success){
      
      return  SaveEmailToBuyer(isValidEmail.data.email, isValidEmail.data.Buyer_code, departmentID);
      
    }else{
      return {status:"error", error:"Email Inputed is not valid"};
      // createToast(`${isValidEmail.error.message} ${BuyerCode}`, "danger", 10000);
    }
    
  }
  async function SaveEmailToBuyer(email_add: string, Buyer_cd:string,  dept_id:number ):Promise<ActionResult<Buyer_email_defn>> {
    
    const BuyerActinResult = await addBuyerEmailToGroup(email_add,Buyer_cd,dept_id);
    if(BuyerActinResult.status != "success"){
      
      return {status:"error", error:`${email_add} for Buyer ${Buyer_cd} ${BuyerActinResult.error}`};
    }
    return BuyerActinResult;
  }



}