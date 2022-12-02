import type { NextPage } from "next"
import { fetchFirestoreDocuments } from "^lib/firebase/firestore/helpers"

const Home: NextPage = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const data = await fetchFirestoreDocuments("subjects", [
            "onehtu",
            "18d39144-c842-4f17-aaec-7e3eecc585ba",
          ])
          console.log("data:", data)
        }}
      >
        Fetch
      </button>
    </div>
  )
}

export default Home
