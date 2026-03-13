# Specora System Permissions Reference

This document outlines the granular permissions available within each module. 
---

## 👤 Profile & User Management
*Permissions related to individual user account management and administrative user control.*

- `view_users` 
- `add_user` 
- `update_user` 
- `delete_user` 
- `update_profile_picture`
- `update_display_name`
- `update_user_name`
- `update_email`
- `update_password`

---

## 📁 Project Module
*Permissions related to the creation and configuration of projects.*

- `view_projects` 
- `create_project`
- `delete_project`
- `update_project_name`
- `update_project_description`
- `update_project_status`
- `update_project_start_date`
- `update_project_end_date`
- `update_project_cover_image`
- `update_project_icon`
- `update_project_members`
- `update_project_tags`

---

## 📋 Requirement Module
*Permissions for managing the core requirements engineering artifacts.*

- `view_requirements`
- `create_requirement`
- `update_requirement`
- `delete_requirement`
- `import_requirement`
- `export_requirement`
- `rollback_requirement` 
- `view_requirement_graph`
- `view_requirement_history`
- `comment_on_requirements`
- `view_requirement_comments` 
- `manage_requirement_dependencies` (Traceability)

---

## 🗣️ Elicitation Module
*Permissions for collaborative gathering and analysis of requirements.*

### 💬 Group Chat
- `view_group_chat_messages`
- `send_group_chat_message`
- `delete_group_chat_message`
- `share_group_chat_files`

### 🤖 Specbot
- `view_specbot_chat`
- `create_specbot_chat`
- `update_specbot_chat`
- `delete_specbot_chat`
- `view_specbot_chat_messages`
- `send_specbot_chat_message`
- `delete_specbot_chat_message`
- `download_specbot_chat_messages`
- `summarize_specbot_chat`
- `extract_requirements_from_specbot_chat`

### 📹 Meetings & Transcription
- `create_meeting`
- `update_meeting`
- `delete_meeting`
- `view_meeting_recording`
- `generate_meeting_transcript`
- `join_meeting`
- `leave_meeting`
- `record_meeting`
- `allow_meeting_camera`
- `allow_meeting_microphone`
- `allow_meeting_screen_sharing`
- `allow_meeting_chat`

### 📝 Feedback & Surveys
- `view_feedback_forms` 
- `create_feedback_form`
- `update_feedback_form`
- `delete_feedback_form`
- `submit_feedback_response` 
- `view_feedback_form_responses` (Managerial view)
- `view_own_feedback_response` 

---

## 🎨 Prototyping Module
*Permissions for creating and managing visual prototypes.*

- `view_prototypes`
- `create_prototype`
- `update_prototype`
- `delete_prototype`
- `manage_prototype_screens` (Add/Edit/Delete/Reorder)
- `link_requirements_to_screens`

---

## 📊 Feasibility & Analysis
*Permissions for economic and technical feasibility studies.*

- `view_feasibility_studies`
- `manage_economic_config` (Rates, Currencies)
- `manage_economic_estimates`
- `run_economic_simulations`
- `view_technical_feasibility`

---

## 📐 Diagrams & Documentation
*Permissions for visual modeling and document generation.*

- `view_diagrams`
- `create_diagram`
- `update_diagram`
- `delete_diagram`
- `view_documents`
- `create_document`
- `update_document`
- `delete_document`

---

## ✅ Verification Module
*Permissions for requirement validation and verification.*

- `run_verification_checks`
- `view_verification_results`