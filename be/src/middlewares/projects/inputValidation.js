export const validateProjectDataInput = (req, res, next) => {
  const project = req.body;

  const nameRegex = /^[A-Za-z0-9 _-]{3,100}$/;
  const descriptionRegex = /^.{5,1000}$/;
  const statusValues = ["active", "on_hold", "completed", "archived"];
  const urlRegex = /^https?:\/\/[^\s]+$/i;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;


  // NAME
  if (project.name) {
    if (!nameRegex.test(project.name)) {
      return res
        .status(400)
        .json({ message: "Invalid project name format/length." });
    }
  }

  // DESCRIPTION
  if (project.description) {
    if (!descriptionRegex.test(project.description)) {
      return res
        .status(400)
        .json({ message: "Project description length not sufficient" });
    }
  }

  // STATUS
  if (project.status) {
    if (!statusValues.includes(project.status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
  }

  // START DATE
  if (project.start_date) {
    if (!dateRegex.test(project.start_date)) {
      return res
        .status(400)
        .json({ message: "start_date must be in YYYY-MM-DD format." });
    }
    const start = new Date(project.start_date);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid start_date." });
    }
  }

  // END DATE
  if (project.end_date) {
    if (!dateRegex.test(project.end_date)) {
      return res
        .status(400)
        .json({ message: "end_date must be in YYYY-MM-DD format." });
    }
    const end = new Date(project.end_date);
    if (isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid end_date." });
    }
  }

  // DATE RANGE
  if (project.start_date && project.end_date) {
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    if (start > end) {
      return res
        .status(400)
        .json({ message: "start_date cannot be later than end_date." });
    }
  }

  // COVER IMAGE URL
  if (project.cover_image_url) {
    if (!urlRegex.test(project.cover_image_url)) {
      return res.status(400).json({ message: "Invalid cover_image_url." });
    }
  }

  // ICON URL
  if (project.icon_url) {
    if (!urlRegex.test(project.icon_url)) {
      return res.status(400).json({ message: "Invalid icon_url." });
    }
  }

  // TAGS

  if (project.tags) {
    if (!Array.isArray(project.tags)) {
      return res.status(400).json({ message: "tags must be an array." });
    }

    if (project.tags.length > 10) {
      return res
        .status(400)
        .json({ message: "A maximum of 10 tags is allowed." });
    }

    for (const tag of project.tags) {
      if (typeof tag !== "string" || tag.length < 3 || tag.length > 30) {
        return res.status(400).json({
          message: "Each tag must be a string between 3 and 30 characters.",
        });
      }
    }
  }

  // MEMBERS

  if (project.members) {
    if (!Array.isArray(project.members)) {
      return res.status(400).json({ message: "members must be an array." });
    }

    for (const member of project.members) {
      if (typeof member !== "string") {
        return res.status(400).json({
          message: "Each member must be a string.",
        });
      }
    }
  }

  next();
};
