/* eslint-disable @typescript-eslint/no-explicit-any */
import produce from "immer"

import { MyOmit } from "^types/utilities"
import { PublishFields } from "^types/entities/entity"
import { formatDateDMYStr } from "./document"

// type `any` used as a workaround to change the type from Timestamp to Date.

export type UnsanitizedFirestoreDocument<
  TEntity extends {
    lastSave: Date | null
    publishDate?: PublishFields["publishDate"]
  }
> = MyOmit<TEntity, "lastSave" | "publishDate"> & {
  lastSave: any
  publishDate: any
}

export function sanitiseNonSerializableDoc<
  TDoc extends {
    lastSave: any
    publishDate: any
  }
>(firestoreDoc: TDoc) {
  return produce(firestoreDoc, (draft) => {
    delete draft.lastSave
    draft.publishDate = draft.publishDate
      ? formatDateDMYStr(draft.publishDate.toDate())
      : null
  })
}

export function sanitiseNonSerializableCollection<
  TDoc extends {
    lastSave: any
    publishDate: any
  }
>(firestoreDoc: TDoc[]) {
  return produce(firestoreDoc, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const doc = draft[i]
      delete doc.lastSave
      doc.publishDate = doc.publishDate
        ? formatDateDMYStr(doc.publishDate.toDate())
        : null
    }
  })
}
