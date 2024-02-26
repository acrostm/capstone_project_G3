import React from 'react';

interface LocalizedDateTimeProps {
  timestamp: string | number | Date;
}

const LocalizedDateTime: React.FC<LocalizedDateTimeProps> = ({ timestamp }) => {
  const formatLocalDateTime = (timestamp: string | number | Date) => {
    const utcDate = new Date(timestamp);
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 使用24小时制
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // 使用用户当地时区
    }).format(utcDate);
  };

  return <span>{formatLocalDateTime(timestamp)}</span>;
};

export default LocalizedDateTime;
