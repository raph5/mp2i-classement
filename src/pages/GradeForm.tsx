import { Button, Input, Select, SelectItem, type Selection } from "@nextui-org/react"
import type React from "react"
import { useEffect, useState } from "react"
import { useSubjects } from "../hooks/useSubjects"
import { Test, useTests } from "../hooks/useTests"
import { clamp, getSelectionItem } from "../utils"
import { usePushGrade } from "../hooks/useGrades"
import ImageButton from "../components/small/ImageButton"

const GradeForm: React.FC = () => {

  // get subjects and tests from firestore
  const [subjects, subjectsLoading] = useSubjects()
  const [testsLib, testsLibLoading] = useTests()

  // form data
  const [grade, setGrade] = useState('')
  const [subjectsSelection, setSubjectsSelection] = useState<Selection>(new Set([]))
  const [testsSelection, setTestsSelection] = useState<Selection>(new Set([]))
  const [photo, setPhoto] = useState<File>()
  // const [isAnonymous, setIsAnonymous] = useState(false)

  // form state
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false);

  // filter tests with curent subject
  const [tests, setTests] = useState<Test[]>([])
  useEffect(() => {
    const subject = getSelectionItem(subjectsSelection)
    if(subject && testsLib.length !== 0) {
      setTests( testsLib.filter(t => t.subject == subject) )
    }
  }, [testsLib, subjectsSelection])

  // get unavailable subjects
  const [unavailableSubjects, setUnavailableSubjects] = useState<string[]>([])
  useEffect(() => {
    const availableSubjects = new Set( testsLib.map(t => t.subject) )
    setUnavailableSubjects( subjects.map(s => s.id).filter(id => !availableSubjects.has(id)) )
  }, [testsLib, subjects])

  // is grade data valid
  const [isValid, setIsValid] = useState(false)
  useEffect(() => {
    setIsValid(
      !Number.isNaN(parseFloat(grade)) &&
      getSelectionItem(subjectsSelection) !== null &&
      getSelectionItem(testsSelection) !== null &&
      Boolean(photo)
    )
  }, [grade, subjectsSelection, testsSelection, photo])

  // camlp grade to [0, 20]
  function campedGrade() {
    const gradeVal = parseFloat(grade)
    if(Number.isNaN(gradeVal)) {
      setGrade('')
    } else {
      setGrade( clamp(gradeVal, 0, 20).toString() )
    }
  }

  // get push grade function
  const [ pushGrade, pushGradeReady ] = usePushGrade()
  
  // submit grade
  async function submitGrade() {
    setLoading(true)
    
    try {
      campedGrade()
      const gradeVal = parseFloat(grade)
      if( Number.isNaN(gradeVal) ) throw new Error("Grade is not a number")
  
      const test = getSelectionItem<string>(testsSelection)
      if(!test) throw new Error("Test is not valid")
  
      const subject = getSelectionItem<string>(subjectsSelection)
      if(!subject) throw new Error("Subject is not valid")

      if(!photo) throw new Error("No photo")
  
      await pushGrade(gradeVal, test, photo)

      setSuccess(true)

      // if grade push success go to main page
      // TODO: change redirection to test ranking page
      // navigate('/#/app')
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <section>
      <h1 className="text-3xl font-medium mb-10">Nouvelle Note</h1>

      <div className="flex flex-col gap-2">
        <Select
          label="Matière"
          selectedKeys={subjectsSelection}
          onSelectionChange={setSubjectsSelection}
          isLoading={subjectsLoading}
          disabledKeys={unavailableSubjects}
        >
          {subjects.map(sub => (
            <SelectItem key={sub.id}>
              {sub.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Devoir"
          selectedKeys={testsSelection}
          onSelectionChange={setTestsSelection}
          isLoading={testsLibLoading}
          isDisabled={tests.length === 0}
        >
          {tests.map(test => (
            <SelectItem key={test.id}>
              {test.name}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="Number"
          placeholder="Note"
          labelPlacement="outside"
          value={grade}
          onValueChange={setGrade}
          onBlur={campedGrade}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small w-max">/ 20</span>
            </div>
          }
        />

        <ImageButton
          onImageChange={setPhoto}
          startContent={
            <span className="material-symbols-rounded">{photo ? 'check' : 'photo_camera'}</span>
          }
        >Joindre un photo de la note</ImageButton>

        {/* <EmojiButton
          startContent={
            <span className="material-symbols-rounded">add_reaction</span>
          }
        >Ajouter un emoji</EmojiButton> */}
        
        {/* <Switch
          isSelected={isAnonymous}
          onValueChange={setIsAnonymous}
        >
          Anonyme
        </Switch> */}

        <Button
          className="mt-6"
          color="primary"
          isDisabled={!isValid}
          isLoading={loading || !pushGradeReady}
          onClick={submitGrade}
          startContent={success && !loading &&
            <span className="material-symbols-rounded">check</span>
          }
        >Ajouter la note</Button>
      </div>
    </section>
  )
}

export default GradeForm