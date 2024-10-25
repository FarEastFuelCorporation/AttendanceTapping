// ./syncronize

const express = require("express");
const router = express.Router();

const cron = require("node-cron");
const IdInformationLocal = require("./modelsLocal/IdInformationLocal");
const IdInformation = require("./models/IdInformation");
const AttendanceLocal = require("./modelsLocal/AttendanceLocal");
const Attendance = require("./models/Attendance");
const Violation = require("./models/Violation");
const ViolationLocal = require("./modelsLocal/ViolationLocal");
const ViolationList = require("./models/ViolationList");
const ViolationListLocal = require("./modelsLocal/ViolationListLocal");

// Function to insert new records into cloud tables
async function syncToCloud(localModel, cloudModel, syncedField = "synced") {
  try {
    const unsyncedRecords = await localModel.findAll({
      where: {
        [syncedField]: false, // Assuming a 'synced' flag
      },
    });

    for (const record of unsyncedRecords) {
      console.log(`Syncing unsynced record with ID ${record.id}...`);
      await cloudModel.create(record.toJSON());

      // Mark the record as synced
      await record.update({ [syncedField]: true });
    }
  } catch (error) {
    console.error(
      `Error syncing ${localModel.name} to ${cloudModel.name}:`,
      error
    );
  }
}

// Function to sync `IdInformation` to `IdInformationLocal`
async function syncIdInformationToLocal() {
  try {
    // Fetch all records from the cloud IdInformation table
    const cloudData = await IdInformation.findAll();

    // Create a set of employee_ids from cloud data for quick lookup
    const cloudIds = new Set(cloudData.map((item) => item.employee_id));

    // Fetch existing records from the local IdInformationLocal table
    const existingLocalRecords = await IdInformationLocal.findAll({
      where: { employee_id: Array.from(cloudIds) },
    });

    // Create a map of existing local records by employee_id for quick lookup
    const localRecordsMap = new Map(
      existingLocalRecords.map((record) => [record.employee_id, record])
    );

    const updates = [];
    const newRecords = [];

    // Iterate through cloud data to determine updates and new inserts
    cloudData.forEach((item) => {
      const localRecord = localRecordsMap.get(item.employee_id);

      if (localRecord) {
        // Prepare update for existing local record
        updates.push({
          id: localRecord.id, // Ensure to include the primary key for update
          first_name: item.first_name,
          middle_name: item.middle_name,
          last_name: item.last_name,
          affix: item.affix,
          type_of_employee: item.type_of_employee,
          designation: item.designation,
          url: item.url,
          birthday: item.birthday,
          contact_number: item.contact_number,
          address: item.address,
          sss_no: item.sss_no,
          pag_ibig_no: item.pag_ibig_no,
          philhealth_no: item.philhealth_no,
          tin_no: item.tin_no,
          contact_person: item.contact_person,
          contact_person_number: item.contact_person_number,
          contact_person_address: item.contact_person_address,
          address2: item.address2,
          contact_person_address2: item.contact_person_address2,
          date_expire: item.date_expire,
          profile_picture: item.profile_picture,
          signature: item.signature,
        });
      } else {
        // Add to new records if not found in local
        newRecords.push(item);
      }
    });

    // If updates are found, use bulkCreate with updateOnDuplicate
    if (updates.length > 0) {
      await IdInformationLocal.bulkCreate(updates, {
        updateOnDuplicate: [
          "first_name",
          "middle_name",
          "last_name",
          "affix",
          "type_of_employee",
          "designation",
          "url",
          "birthday",
          "contact_number",
          "address",
          "sss_no",
          "pag_ibig_no",
          "philhealth_no",
          "tin_no",
          "contact_person",
          "contact_person_number",
          "contact_person_address",
          "address2",
          "contact_person_address2",
          "date_expire",
          "profile_picture",
          "signature",
        ], // Specify fields to update
      });
      console.log(
        `Updated ${updates.length} existing records in IdInformationLocal.`
      );
    } else {
      console.log("No existing records to update.");
    }

    // If new records are found, insert them into IdInformationLocal
    if (newRecords.length > 0) {
      await IdInformationLocal.bulkCreate(newRecords);
      console.log(
        `Inserted ${newRecords.length} new records into IdInformationLocal.`
      );
    } else {
      console.log("No new records to insert.");
    }
  } catch (error) {
    console.error("Error syncing IdInformation to IdInformationLocal:", error);
  }
}

// Function to sync `ViolationList` to `ViolationListLocal`
async function syncViolationListToLocal() {
  try {
    // Fetch all records from the cloud ViolationList table
    const cloudData = await ViolationList.findAll();

    // Create a set of violation_ids from cloud data for quick lookup
    const cloudIds = new Set(cloudData.map((item) => item.violation_id));

    // Fetch existing records from the local ViolationListLocal table
    const existingLocalRecords = await ViolationListLocal.findAll({
      where: { violation_id: Array.from(cloudIds) },
    });

    // Create a map of existing local records by violation_id for quick lookup
    const localRecordsMap = new Map(
      existingLocalRecords.map((record) => [record.violation_id, record])
    );

    const updates = [];
    const newRecords = [];

    // Iterate through cloud data to determine updates and new inserts
    cloudData.forEach((item) => {
      const localRecord = localRecordsMap.get(item.violation_id);

      if (localRecord) {
        // Prepare update for existing local record
        updates.push({
          violation_id: item.violation_id,
          description: item.description,
        });
      } else {
        // Add to new records if not found in local
        newRecords.push(item);
      }
    });

    // If updates are found, use bulkCreate with updateOnDuplicate
    if (updates.length > 0) {
      await ViolationListLocal.bulkCreate(updates, {
        updateOnDuplicate: ["description"], // Specify fields to update
      });
      console.log(
        `Updated ${updates.length} existing records in ViolationListLocal.`
      );
    } else {
      console.log("No existing records to update.");
    }

    // If new records are found, insert them into ViolationListLocal
    if (newRecords.length > 0) {
      await ViolationListLocal.bulkCreate(newRecords);
      console.log(
        `Inserted ${newRecords.length} new records into ViolationListLocal.`
      );
    } else {
      console.log("No new records to insert.");
    }
  } catch (error) {
    console.error("Error syncing ViolationList to ViolationListLocal:", error);
  }
}

// Function to sync `Violation` to `ViolationLocal`
async function syncViolationToLocal() {
  try {
    // Fetch all records from the cloud Violation table
    const cloudData = await Violation.findAll();

    // Fetch existing records from the local ViolationLocal table
    const existingLocalRecords = await ViolationLocal.findAll();

    // Create a map of existing local records by their IDs for quick lookup
    const localRecordsMap = new Map(
      existingLocalRecords.map((record) => [record.id, record])
    );

    const updates = [];
    const newRecords = [];

    // Iterate through cloud data to determine updates and new inserts
    cloudData.forEach((item) => {
      const localRecord = localRecordsMap.get(item.id);

      if (localRecord) {
        // Update existing local record
        updates.push({
          id: item.id,
          employee_id: item.employee_id,
          violation_id: item.violation_id,
          updatedAt: new Date(), // assuming you want to update the timestamp
        });
      } else {
        // Add to new records if not found in local
        newRecords.push(item);
      }
    });

    // If updates are found, use bulkCreate with updateOnDuplicate
    if (updates.length > 0) {
      await ViolationLocal.bulkCreate(updates, {
        updateOnDuplicate: ["employee_id", "violation_id", "updatedAt"], // Specify fields to update
      });
      console.log(
        `Updated ${updates.length} existing records in ViolationLocal.`
      );
    } else {
      console.log("No existing records to update.");
    }

    // If new records are found, insert them into ViolationLocal
    if (newRecords.length > 0) {
      await ViolationLocal.bulkCreate(newRecords);
      console.log(
        `Inserted ${newRecords.length} new records into ViolationLocal.`
      );
    } else {
      console.log("No new records to insert.");
    }
  } catch (error) {
    console.error("Error syncing Violation to ViolationLocal:", error);
  }
}

// Function to sync unsynced AttendanceLocal records to Attendance
async function syncUnsyncedAttendance() {
  try {
    // Fetch unsynced records from AttendanceLocal
    const unsyncedRecords = await AttendanceLocal.findAll({
      where: { synced: false }, // Only get records that have not been synced
    });

    if (unsyncedRecords.length === 0) {
      console.log("No unsynced attendance records found.");
      return;
    }

    // Prepare data for bulk create without including the primary key
    const recordsToSync = unsyncedRecords.map((record) => ({
      employee_id: record.employee_id, // Only include necessary fields
      status: record.status,
      // No need to include `id` since it's auto-incremented
    }));

    // Perform bulk create in Attendance
    await Attendance.bulkCreate(recordsToSync, {
      ignoreDuplicates: true, // Prevent errors on primary key conflicts
    });

    // Mark these records as synced in AttendanceLocal
    await AttendanceLocal.update(
      { synced: true }, // Update the synced status
      { where: { id: unsyncedRecords.map((record) => record.id) } } // Mark records as synced
    );

    console.log(
      `Successfully synced ${recordsToSync.length} attendance records.`
    );
  } catch (error) {
    console.error("Error during attendance sync:", error);
  }
}

// Scheduled synchronization using cron
// Sync IdInformation to IdInformationLocal at 9 PM every day
cron.schedule("0 21 * * *", async () => {
  console.log("Running syncIdInformationToLocal at 9 PM");
  await syncIdInformationToLocal();
});

// Sync ViolationList and Violation at 5 AM, 1 PM, 4 PM, and 5 PM every day
cron.schedule("0 5,13,16,17 * * *", async () => {
  console.log("Running syncViolationListToLocal and syncViolationToLocal");
  await syncViolationListToLocal();
  await syncViolationToLocal();
});

async function handleAttendanceSync() {
  console.log("Syncing unsynced attendance records in real-time");
  try {
    await syncUnsyncedAttendance();
  } catch (error) {
    console.error("Error during attendance sync:", error);
    // You can log the error to a file, send a notification, etc.
  }
}

console.log("Scheduled synchronization tasks are set.");

module.exports = {
  router,
  handleAttendanceSync,
};
