export const SRS_TEMPLATE = `
  <h1>System Requirements Specification (SRS)</h1>
  <p><em>Type your project title here...</em></p>
  <hr />

  <h2>1. Introduction</h2>
  <h3>1.1 Purpose</h3>
  <p>Identify the purpose of this SRS and its intended audience.</p>

  <h3>1.2 Document Conventions</h3>
  <p>Describe any standards or typographical conventions that were followed when writing this SRS.</p>

  <h3>1.3 Intended Audience and Reading Suggestions</h3>
  <p>Describe the different types of reader that the document is intended for, such as developers, project managers, marketing staff, users, testers, and documentation writers.</p>

  <h3>1.4 Product Scope</h3>
  <p>Provide a short description of the software being specified and its purpose.</p>

  <h2>2. Overall Description</h2>
  <h3>2.1 Product Perspective</h3>
  <p>Describe the context and origin of the product being specified in this SRS.</p>

  <h3>2.2 Product Functions</h3>
  <p>Summarize the major functions the product must perform or must let the user perform.</p>

  <h3>2.3 User Classes and Characteristics</h3>
  <p>Identify the various user classes that you anticipate will use this product.</p>

  <h2>3. Specific Requirements</h2>
  <h3>3.1 External Interface Requirements</h3>
  <ul>
    <li><strong>User Interfaces:</strong> Describe the logical characteristics of each interface between the software product and the users.</li>
    <li><strong>Hardware Interfaces:</strong> Describe the logical and physical characteristics of each interface.</li>
    <li><strong>Software Interfaces:</strong> Describe the connections between this product and other specific software components.</li>
  </ul>

  <h3>3.2 Functional Requirements</h3>
  <p>List detailed functional requirements here.</p>
  <ol>
    <li>Describe feature 1...</li>
    <li>Describe feature 2...</li>
  </ol>
`;

export const TUC_TEMPLATE = `
  <h1>Textual Use Case Specification</h1>
  <p><em>Complete the details for your specific use case.</em></p>
  <hr />

  <table>
    <tbody>
      <tr>
        <td><strong>Use Case Name</strong></td>
        <td>[Enter Use Case Name]</td>
      </tr>
      <tr>
        <td><strong>Primary Actor</strong></td>
        <td>[Who initiates the use case?]</td>
      </tr>
      <tr>
        <td><strong>Secondary Actors</strong></td>
        <td>[Any systems or personnel involved?]</td>
      </tr>
      <tr>
        <td><strong>Goal in Context</strong></td>
        <td>[Brief summary of the objective]</td>
      </tr>
      <tr>
        <td><strong>Preconditions</strong></td>
        <td>
          <ul>
            <li>[Condition 1 that must be true beforehand]</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>Main Success Scenario (Basic Flow)</strong></td>
        <td>
          <ol>
            <li>The actor starts by...</li>
            <li>The system responds with...</li>
            <li>The actor...</li>
            <li>The use case concludes when...</li>
          </ol>
        </td>
      </tr>
      <tr>
        <td><strong>Extensions (Alternate Flows)</strong></td>
        <td>
          <p><strong>3a. Validation fails:</strong></p>
          <ul>
            <li>System displays an error message.</li>
            <li>Actor corrects the data.</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>Postconditions</strong></td>
        <td>
          <ul>
            <li>[State of the system after success]</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>Exceptions</strong></td>
        <td>[What happens if the use case encounters a fatal error?]</td>
      </tr>
    </tbody>
  </table>
`;

export const GENERAL_TEMPLATE = `
  <h1>Untitled Document</h1>
  <p><em>Start typing your document here...</em></p>
`;

export function getTemplateForType(type) {
  if (type === "srs") return SRS_TEMPLATE;
  if (type === "use_case") return TUC_TEMPLATE;
  return GENERAL_TEMPLATE;
}
