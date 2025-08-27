import z, { email } from "zod";


export const signupValidation = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string().optional(),
});

export const singinValidation = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const createBlogValidation=z.object({
    content:z.string(),
    title:z.string(),
    publish:z.boolean().optional()
    
})

const updateBlogValidation=z.object({
    content:z.string(),
    title:z.string(),
    publish:z.boolean().optional(),
    id:z.number()

})


export type UpdateBlogValidation=z.infer<typeof updateBlogValidation>
export type CreateBlogValidation=z.infer<typeof createBlogValidation>
export type SinginValidation = z.infer<typeof singinValidation>;
export type SignupValidation = z.infer<typeof signupValidation>;
