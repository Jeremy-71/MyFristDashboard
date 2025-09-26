// 'use server';
// import postgres from 'postgres';
// import Postgres from 'postgres';
// const sql = postgres(process.env.POSTGRES_URL!,{ssl: 'require'})
// import { z } from 'zod';
// const FormSchema = z.object({
//   id: z.string(),
//   customerId: z.string(),
//   amount: z.coerce.number(),
//   status: z.enum(['pending', 'paid']),
//   date: z.string(),
   
// });
 


// const CreateInvoice = FormSchema.omit({ id: true, date: true });
// export async function createInvoice(formData: FormData) {
//   const { customerId, amount, status } = CreateInvoice.parse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });
//   const amountIncents=amount*100;
//   const date = new Date().toISOString().split('T')[0];
//   await sql`
//     INSERT INTO invoices (customer_id, amount, status, date)
//     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
//   `;
// }

  
  // Test it out:
  //console.log(typeof rawFormData.amount);

  'use server';
import postgres from 'postgres';
import { z } from 'zod';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
// ✅ Setup Postgres client
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ✅ Define schema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// ✅ CreateInvoice schema without id & date (auto-handled)
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// ✅ Create invoice function
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // ✅ Convert amount to cents
  const amountInCents = amount * 100;

  // ✅ Format date (YYYY-MM-DD)
  const date = new Date().toISOString().split('T')[0];

  // ✅ Insert into DB
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}
