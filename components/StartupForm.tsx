"use client";
import React, { useActionState, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

const StartupForm = () => {
  // We need to add record here because this is typescript. and the problem is that typescript doesnt know what properties this object will have.
  // And when we try to use errors.title, typescript gets confused cuz its thinking does title even exist in this object?
  // By adding Record<string,string> its saying that the object will have string keys and string values
  // It can have string keys like 'title', 'description', etc, and all the values will be strings as well
  // RECORD DESCRIBES THE CONTENTS, NOT THE CONTAINER
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");

  // prevState and formData are automatically provided by next.js when you use server actions (form action)
  // Why is prevState important? -> without it, user submits form with no title. form resets but there is no feedback so user doesnt know what happened or if it went through
  // With prevState, user submits form with empty title, the form shows "please enter a title" which comes from prev state. and if they add a title, itll show success (also from prevstate)
  // The reason why we give prevState a value of any is because it can be different things (1 error, sucess, or multiple errors, or null(first time)). however, its not best practice. best practice is to create a type alias of what prevState can actually be .

  // When the user submits the form, the browser automatically creates a FormData object with all the form inputs.
  // Next.js receives the FormData and takes that object and passes it to our function as the formData parameter
  const handleFormSubmit = (prevState: any, formData: FormData) => {};

  // useActionState is a react hook that handles form submissions with server actions
  // It's like a special version of useState thats specifically for form submissions

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={() => {}} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (e.g., Tech, Health, Education...)"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          // This part is important -> we need to create an anonymous arrow inline function here because of how MDEditor works. it's onchange function might send undefined or other types if its empty. but setPitch is only expecting strings. so we make sure that whatever gets given by mdeditor (value) is set as string
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit" // This is what got rid of the double view. can be set as either as edit, preview or live. live shows both.
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit your pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;

/*
type FormState = {
  error?: string;
  success?: boolean;
  errors?: Record<string, string>;
} | null;

heres an example of the type alias you should be defined prevState with
so you would do prevState: formState


*/
