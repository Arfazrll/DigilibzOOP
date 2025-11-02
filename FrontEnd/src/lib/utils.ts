export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    DECLINED: 'bg-red-100 text-red-800',
    OVERDUE: 'bg-orange-100 text-orange-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    BORROW: 'bg-blue-100 text-blue-800',
    RETURN: 'bg-purple-100 text-purple-800',
  };
  return typeColors[type] || 'bg-gray-100 text-gray-800';
};

export const getNotificationTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    INFO: 'bg-blue-100 text-blue-800',
    REMINDER: 'bg-yellow-100 text-yellow-800',
    ALERT: 'bg-red-100 text-red-800',
  };
  return typeColors[type] || 'bg-gray-100 text-gray-800';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};