import { PageHeader } from "@/components"
import { Button } from '@/components/ui'
import {useState} from 'react'

export const ButtonStyles = () => {
  const [selected, setSelected] = useState("");

  const handleClick = (buttonName:string) => {
    console.log(`${buttonName} button clicked!`)
    const bnt = selected === buttonName ? "" : buttonName;
    setSelected(buttonName);
  }

  return (
    <div className="page-container">
      <PageHeader
        title="UI Components"
        description="Reusable Buttons and Styles."
      />

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="section-title">Buttons</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
          <h3 className="font-semibold text-unifirst-gray-dark mb-4">Variants</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              aria-pressed={selected === "primary"}
              onClick={() => handleClick("primary")}
              variant="primary"
            >
              Primary
            </Button>
            <Button
              aria-pressed={selected === "secondary"}
              onClick={() => handleClick("secondary")}
              variant="secondary"
            >
              secondary
            </Button>
            <Button
              aria-pressed={selected === "outline"}
              onClick={() => handleClick("outline")}
              variant="outline"
            >
              Outline
            </Button>

            <Button
              aria-pressed={selected === "ghost"}
              onClick={() => handleClick("ghost")}
              variant="ghost"
            >
              Ghost
            </Button>

            <Button
              aria-pressed={selected === "destructive"}
              onClick={() => handleClick("destructive")}
              variant="destructive"
            >
              destructive
            </Button>
          </div>

          <h3 className="font-semibold text-unifirst-gray-dark mb-4">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button
              aria-pressed={selected === "primary-sm"}
              onClick={() => handleClick("primary-sm")}
              size="sm"
            >
              Small
            </Button>

            <Button
              aria-pressed={selected === "primary-md"}
              onClick={() => handleClick("primary-md")}
              size="md"
            >
              Medium
            </Button>

            <Button
              className='text-[16px]'
              aria-pressed={selected === "primary-lg"}
              onClick={() => handleClick("primary-lg")}
              size="lg"
            >
              Large
            </Button>
          </div>

          <h3 className="font-semibold text-unifirst-gray-dark mb-4">States</h3>
          <div className="flex flex-wrap gap-4 mb-8">

            <Button
              aria-pressed={selected === "default"}
              onClick={() => handleClick("default")}
              variant="default"
            >
              Default
            </Button>

            <Button
              aria-pressed={true}
              onClick={() => handleClick("focused")}
              variant="primary"
            >
              Focused
            </Button>

            <Button
              aria-pressed={selected === "disabled"}
              onClick={() => handleClick("disabled")}
              variant="primary"
              disabled={true}
            >
              Disabled
            </Button>

          </div>

        </div>
      </section>
    </div>
  )
}