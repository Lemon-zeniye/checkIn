import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ConvertToDateOnly = (date: string | number): string => {
  const parsedDate = new Date(date);

  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear().toString().slice(-2);

  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
};

export const ConvertToDate = (date: string): string => {
  const parsedDate = new Date(date);

  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear().toString().slice(-2);
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();

  const formattedDate = `${month}/${day}/${year} ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return formattedDate;
};

type DateParts = {
  year: number;
  month: number;
  day: number;
};

export function getDateParts(dateString: string): DateParts {
  const date = new Date(dateString);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1, // Months are 0-indexed
    day: date.getUTCDate(),
  };
}

export function formatDateToMonthYear(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };

  return date.toLocaleDateString("en-US", options);
}

export function formatDateSmart(
  dateString: string,
  showExactDate = false
): string {
  const date = new Date(dateString);
  const today = new Date();

  // Normalize to ignore time
  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const dayDiff =
    (normalize(today).getTime() - normalize(date).getTime()) /
    (1000 * 60 * 60 * 24);

  const exactDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  if (dayDiff === 0) return showExactDate ? `Today, ${exactDate}` : "Today";
  if (dayDiff === 1)
    return showExactDate ? `Yesterday, ${exactDate}` : "Yesterday";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };

  return date.toLocaleDateString(
    "en-US",
    showExactDate
      ? {
          month: "long",
          day: "numeric",
        }
      : options
  );
}

export const tos = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        backgroundColor: "#4ade80",
        color: "white",
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
};

export function formatMessageTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HasCreatedAt {
  createdAt: string;
}

export function groupMessagesByDate<T extends HasCreatedAt>(messages: T[]) {
  const groups: { [key: string]: T[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    let label = format(date, "yyyy-MM-dd");

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(message);
  });

  return groups;
}

export function getImageUrl(image: string | undefined): string {
  if (typeof image === "string") {
    return `https://awema.co/${image?.replace("public/", "")}`;
  }
  return "image";
}

export function toMonthDayYear(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

type PathInput = string | string[] | null | undefined;

export const formatImageUrls = (
  paths: PathInput,
  baseUrl: string = "https://awema.co"
): string | string[] => {
  const formatSinglePath = (path: string | null | undefined): string => {
    if (!path) return "";
    return `${baseUrl}/${path.replace("public/", "")}`;
  };

  if (Array.isArray(paths)) {
    return paths.map((path) => formatSinglePath(path));
  }

  return formatSinglePath(paths);
};

export const formatImageUrl = (
  path: string,
  baseUrl: string = "https://awema.co"
): string => {
  if (!path) {
    return "";
  }
  return `${baseUrl}/${path.replace("public/", "")}`;
};

// Transform the infinite query data

export function truncateText(text: string, length = 30): string {
  return text.length > length ? text.slice(0, length) + "..." : text;
}
