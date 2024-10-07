const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batch_name: { type: String, required: true },
  start_date: { type: Date, required: true },
  no_of_classes: { type: Number, required: true },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  student_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
  contentMaterial: { type: String },
  date: { type: Date, default: Date.now },

  meeting_link: { type: String },
});

batchSchema.virtual("no_of_participant").get(function () {
  return this.students.length;
});

// Ensure virtual fields are serialized
batchSchema.set("toJSON", { virtuals: true });
batchSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Batch", batchSchema);
