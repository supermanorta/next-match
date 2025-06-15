 9 |     const editButtonText = "Dummy Button Text";
      10 |
    > 11 |     render(
         |           ^
      12 |       <EditListMenu
      13 |         selectedListName={selectedListObject.value.toString()}
      14 |         listTitle={"RPC All"}

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:55:29)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.dispatchEvent (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at apply (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at callback (node_modules/react/cjs/react.development.js:2667:24)
      at flushActQueue (node_modules/react/cjs/react.development.js:2582:11)
      at actImplementation (node_modules/@testing-library/react/dist/act-compat.js:47:25)
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:24)
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:292:10)
      at Object.<anonymous> (src/tests/admin/RPCMgmtList.test.tsx:11:11)

    console.error
      The above error occurred in the <EditListMenu> component:
      
          at selectedListName (/Users/m112758/Projects/appLocal/NewQIS/quality-inspection-system-2/src/components/admin/EditListMenu.tsx:52:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

       9 |     const editButtonText = "Dummy Button Text";
      10 |
    > 11 |     render(
         |           ^
      12 |       <EditListMenu
      13 |         selectedListName={selectedListObject.value.toString()}
      14 |         listTitle={"RPC All"}

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at call (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at callback (node_modules/react/cjs/react.development.js:2667:24)
      at flushActQueue (node_modules/react/cjs/react.development.js:2582:11)
      at actImplementation (node_modules/@testing-library/react/dist/act-compat.js:47:25)
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:24)
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:292:10)
      at Object.<anonymous> (src/tests/admin/RPCMgmtList.test.tsx:11:11)

    console.error
      Error: Uncaught [TypeError: Cannot read properties of undefined (reading 'get')]