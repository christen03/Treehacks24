import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("lectures")
      .filter((q) => q.eq(q.field("teacher"), userId))
      .collect();
  },
});

export const deleteClass = mutation({
  args: { taskId: v.id("lectures"), storageId: v.id("_storage") },
  handler: async (ctx, { taskId, storageId }) => {
    await ctx.storage.delete(storageId);
    await ctx.db.delete(taskId);
  },
});

export const getClassesByEmail =  query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("teacherEmail"), email))
      .collect();
  },
})

export const createNewClass = mutation({
  args: { teacherEmail: v.string() },
  handler: async (ctx, { teacherEmail }) => {
    const classId = await ctx.db.insert("classes",{ teacherEmail: teacherEmail, students: [], lectures: []})
    return classId;
  },
})

export const addStudentToClass = mutation({
  args: { studentId: v.id("students"), teacherEmail: v.string() },
  handler: async (ctx, { studentId, teacherEmail }) => {
    const school = await ctx.db.query("classes").filter((q) => q.eq(q.field("teacherEmail"), teacherEmail)).first()
    const classId = school._id
    const currentStudents = await ctx.db.get(classId)
    if(currentStudents.includes(studentId)){
        return
    }
    await ctx.db.patch(classId, { students: [...currentStudents, studentId] })
  },
})
