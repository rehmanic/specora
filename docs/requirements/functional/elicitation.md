## Elicitation
This module includes different techniques to elicit requirements from the client. It involves extracting requirements from text using NLP techniques or a LLM.

### Chatbot
* **FR-EL-01:** The system shall provide an AI-driven chatbot capable of interacting with clients through both text and audio input for eliciting project requirements.
* **FR-EL-02:** The system shall convert audio inputs into text before requirement extraction.
* **FR-EL-03:** The system shall use NLP-based algorithms to extract functional and non-functional requirements from the chatbot conversation text.
* **FR-EL-04:** The chatbot shall use a configurable knowledge base and custom instructions while responding.

### Meetings
* **FR-EL-05:** The system shall allow Managers and Requirement Engineers to create, schedule, and manage meetings.
* **FR-EL-06:** The system shall record meeting details, including participants, date/time, and meeting link.
* **FR-EL-07:** The system shall automatically notify stakeholders via email upon meeting creation, update, or cancellation.
* **FR-EL-08:** The system shall prevent scheduling conflicts for stakeholders with overlapping meetings.
* **FR-EL-09:** The system shall display upcoming and previous meetings for authorized users.
* **FR-EL-10:** The system shall allow Managers and Requirement Engineers to edit or cancel upcoming meetings.
* **FR-EL-11:** The system shall maintain an audit trail for all meeting-related actions.
* **FR-EL-12:** The system shall provide role-based access control for all meeting operations.
* **FR-EL-13:** The system shall extract audio streams from recorded meetings and convert them into text transcripts using speech-to-text technology.
* **FR-EL-14:** The system shall use NLP-based algorithms to extract requirements automatically from meeting transcripts.

### Feedback
* **FR-EL-15:** The system shall allow requirement engineers to create feedback forms, surveys, or questionnaires for requirement elicitation and clarification.
* **FR-EL-16:** The system shall support two modes of form creation:
    * **a)** Manual form creation using a form editor.
    * **b)** Automatic form generation using the structure defined in JSON by a LLM.
* **FR-EL-17:** The system shall store and manage all form responses submitted by clients.
* **FR-EL-18:** The system shall allow authorized users to edit forms and corresponding responses while maintaining a version history for each modification. 
* **FR-EL-19:** The system shall use NLP-based algorithms to extract requirements from responses. 

### General
* **FR-EL-20:** The system shall store each extracted requirement with its metadata (type, status: raw, verified, etc.).
* **FR-EL-21:** The system shall provide an option to extract requirements automatically from uploaded or manually entered text using an LLM as a fallback method.