import moment from "moment-timezone";

export const timestampDate = (timestamp) => {
  return moment(timestamp).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss");
};

export const parseTimeString = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

export const formatWeight = (weight) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(weight);
};

export const formatNumber = (weight) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(weight);
};

export const formatWeightWithNA = (weight) => {
  if (weight === "N/A" || weight === 0) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(weight);
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatDate2 = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate(); // Get the day of the month
  const month = date.toLocaleString("en-US", { month: "short" }); // Get the abbreviated month
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  return `${day}-${month}-${year}`;
};

export const formatDateFull = (date) => {
  // Check if date is null, undefined, or invalid
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

// Function to format the time
export const formatTime = (dateString) => {
  const date = new Date(dateString); // Convert the string to a Date object
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Pad minutes and seconds with leading zeros
  const formattedTime = `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")} ${ampm}`;
  return formattedTime;
};

export const calculateRemainingDays = (expirationDate) => {
  if (expirationDate === null) {
    return null; // Handle invalid dates
  } else if (!expirationDate || isNaN(new Date(expirationDate).getTime())) {
    return "N/A"; // Handle invalid dates
  }

  const currentDate = new Date();
  const expiration = new Date(expirationDate);

  // Calculate the difference in time (milliseconds)
  const timeDiff = expiration.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysRemaining; // Return the remaining days (negative if expired)
};

export function calculateRemainingTime(expirationDate) {
  const now = new Date();
  const expiration = new Date(expirationDate);

  // Zero out the time part to compare dates only
  now.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  // Calculate the difference in time
  const differenceInTime = expiration - now; // in milliseconds

  // Calculate total days
  const totalDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  // Check if the date is expired
  const isExpired = totalDays < 0;

  // Use absolute value to calculate the year/month/day breakdown
  const absoluteDays = Math.abs(totalDays);

  const years = Math.floor(absoluteDays / 365); // Approximate years
  const months = Math.floor((absoluteDays % 365) / 30); // Approximate months
  const days = absoluteDays % 30; // Remaining days

  return { years, months, days, isExpired, totalDays };
}

export const getLatestTreatedDate = (transactions) => {
  return transactions.reduce((latest, waste) => {
    if (waste.TreatedWasteTransaction.length > 0) {
      const latestInWaste = waste.TreatedWasteTransaction.reduce(
        (latestDate, transaction) => {
          const treatedDate = new Date(transaction.treatedDate);
          return treatedDate > new Date(latestDate)
            ? treatedDate
            : new Date(latestDate);
        },
        new Date(0)
      );
      return latestInWaste > new Date(latest)
        ? latestInWaste
        : new Date(latest);
    }
    return new Date(latest);
  }, new Date(0));
};

export const formatDateWithSuffix = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Determine suffix
  const suffix = (day) => {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const suffixStr = suffix(day);

  // Return an object with day, suffix, and the rest of the date string
  return {
    day: day,
    suffix: suffixStr,
    dateString: `day of ${month} ${year}`,
  };
};

export function calculateAge(dateOfBirth) {
  // Ensure the input is a Date object
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the current date is before the birth date this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function concatenatePresentAddress(selectedRow) {
  const { province, municipality, barangay, address } = selectedRow;

  // Initialize an array to hold non-null/undefined values
  const addressComponents = [];

  // Check each component and add to the array if valid
  if (address != null) addressComponents.push(address);
  if (barangay != null) addressComponents.push(`BRGY. ${barangay}`);
  if (municipality != null) addressComponents.push(municipality);
  if (province != null) addressComponents.push(province);

  // Return "NO Data" if no valid components were found
  if (addressComponents.length === 0) {
    return "No Data";
  }

  // Join the components with a comma and space
  return addressComponents.join(", ");
}

export function concatenatePermanentAddress(selectedRow) {
  const { otherProvince, otherMunicipality, otherBarangay, otherAddress } =
    selectedRow;

  // Initialize an array to hold non-null/undefined values
  const addressComponents = [];

  // Check each component and add to the array if valid
  if (otherAddress != null) addressComponents.push(otherAddress);
  if (otherBarangay != null) addressComponents.push(`BRGY. ${otherBarangay}`);
  if (otherMunicipality != null) addressComponents.push(otherMunicipality);
  if (otherProvince != null) addressComponents.push(otherProvince);

  // Return "NO Data" if no valid components were found
  if (addressComponents.length === 0) {
    return "No Data";
  }

  // Join the components with a comma and space
  return addressComponents.join(", ");
}

export function calculateLengthOfService(startDate) {
  // Convert the startDate to a Date object
  const start = new Date(startDate);
  const today = new Date();

  // Calculate the difference in years, months, and days
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      0
    );
    days += previousMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  // Create an array to hold the parts of the result
  const resultParts = [];

  // Add years to the result if not zero
  if (years > 0) {
    resultParts.push(`${years} year${years > 1 ? "s" : ""}`);
  }

  // Add months to the result if not zero
  if (months > 0) {
    resultParts.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  // Add days to the result if not zero
  if (days > 0) {
    resultParts.push(`${days} day${days > 1 ? "s" : ""}`);
  }

  // If no parts, return "No data"
  if (resultParts.length === 0) {
    return "No data";
  }

  // Join the parts with commas
  return resultParts.join(", ");
}
