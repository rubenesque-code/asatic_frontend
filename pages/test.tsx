import produce from "immer"
import tw from "twin.macro"

const Test = () => {
  return (
    <div css={[tw`ml-md mt-md`]}>
      <h1 css={[tw`font-medium`]}>Test</h1>
      <div css={[tw`flex flex-col gap-sm mt-md`]}>
        <div>
          <h2>Initial</h2>
          {JSON.stringify(initialObj)}
        </div>
        <div>
          <h2>Immered forEach</h2>
          {JSON.stringify(immered)}
        </div>
        <div>
          <h2>Immered forEach abstraction</h2>
          {JSON.stringify(immeredForEachAb)}
        </div>
        <div>
          <h2>Immered forEach abstraction 2</h2>
          {JSON.stringify(immeredForEachAb2)}
        </div>
      </div>
    </div>
  )
}

export default Test

// test abstraction of for loop works in immer's `produce`

const initialObj = { arrField: ["abc", "123", "oh"] }

const immered = produce(initialObj, (draft) => {
  draft.arrField.forEach((id, i) => {
    if (id === "abc") {
      draft.arrField.splice(i, 1)
    }
  })
})

const abForEach = (obj: typeof initialObj) => {
  obj.arrField.forEach((id, i) => {
    if (id === "abc") {
      obj.arrField.splice(i, 1)
    }
  })
}

const immeredForEachAb = produce(initialObj, (draft) => {
  abForEach(draft)
})

const abForEach2 = (arr: typeof initialObj["arrField"]) => {
  arr.forEach((id, i) => {
    if (id === "abc") {
      arr.splice(i, 1)
    }
  })
}

const immeredForEachAb2 = produce(initialObj, (draft) => {
  abForEach2(draft.arrField)
})
