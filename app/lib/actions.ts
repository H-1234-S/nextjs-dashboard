'use server' //Next.js 才会把它变成一个“地址（URL）”传给前端，而不是传代码本身。
import { z } from "zod/v4";
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),    //强制转换（改变）从字符串到数字
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

// 新规则省略 id 和 data 属性
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    /**
     *  new Data() 创建一个当前日期对象 Sat Mar 14 2026 14:15:00 GMT+0800
     * 
     *  toISOString() 将日期对象转换为 ISO 8601 标准的字符串格式。 "2026-03-14T06:15:00.000Z"
     * 
     *  .split('T')[0] 以T为分隔符，将字符串转为数组并取第一个
     */
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices')
}