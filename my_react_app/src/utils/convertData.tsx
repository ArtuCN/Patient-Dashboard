export function date_converter(date: string): string
{
    let new_date = date.substring(0, 10);
    return new_date;
}
export function formatDateForInput(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}
