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

// Function to sync `IdInformation` to `IdInformationLocal`
async function syncIdInformationToLocal() {
  try {
    // Step 1: Fetch all employee_id values from the cloud IdInformation table
    const cloudIdsData = await IdInformation.findAll({
      attributes: ["employee_id"], // Fetch only the employee_id column
    });

    const cloudIds = cloudIdsData.map((item) => item.employee_id); // Extract employee_id values

    // Step 2: Fetch existing records from the local IdInformationLocal table
    const existingLocalRecords = await IdInformationLocal.findAll({
      where: { employee_id: cloudIds },
    });

    const localRecordsMap = new Map(
      existingLocalRecords.map((record) => [record.employee_id, record])
    );

    const processInBatches = async (items, batchSize, processFunction) => {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        await processFunction(batch);
      }
    };

    // Step 3: Fetch and synchronize cloud data in batches of 10
    await processInBatches(cloudIds, 10, async (batchIds) => {
      // Fetch cloud records for the current batch
      const batchData = await IdInformation.findAll({
        where: { employee_id: batchIds },
      });

      const updates = [];
      const newRecords = [];

      // Determine updates and new inserts for the current batch
      batchData.forEach((item) => {
        const localRecord = localRecordsMap.get(item.employee_id);

        if (localRecord) {
          updates.push({
            id: localRecord.id, // Ensure to include the primary key for update
            employee_id: item.employee_id, // Explicitly include employee_id
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
          newRecords.push({
            employee_id: item.employee_id, // Ensure employee_id is included
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
        }
      });

      // Perform updates for the current batch
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
          ],
        });
        console.log(`Updated a batch of ${updates.length} records.`);
      }

      // Perform inserts for the current batch
      if (newRecords.length > 0) {
        await IdInformationLocal.bulkCreate(newRecords);
        console.log(`Inserted a batch of ${newRecords.length} new records.`);
      }
    });

    console.log("Synchronization complete.");
  } catch (error) {
    console.error("Error syncing IdInformation to IdInformationLocal:", error);
  }
}

// Function to sync a specific employee ID to `IdInformationLocal`
async function syncSpecificEmployeeToLocal(employeeId) {
  try {
    // Step 1: Fetch the record from the cloud `IdInformation` table
    const cloudRecord = await IdInformation.findOne({
      where: { employee_id: employeeId },
    });

    if (!cloudRecord) {
      console.log(
        `No record found in the cloud for employee_id: ${employeeId}`
      );
      return;
    }

    // Step 2: Check if the record exists in the local `IdInformationLocal` table
    const localRecord = await IdInformationLocal.findOne({
      where: { employee_id: employeeId },
    });

    if (localRecord) {
      // Step 3: Update the existing record
      await IdInformationLocal.update(
        {
          first_name: cloudRecord.first_name,
          middle_name: cloudRecord.middle_name,
          last_name: cloudRecord.last_name,
          affix: cloudRecord.affix,
          type_of_employee: cloudRecord.type_of_employee,
          designation: cloudRecord.designation,
          url: cloudRecord.url,
          birthday: cloudRecord.birthday,
          contact_number: cloudRecord.contact_number,
          address: cloudRecord.address,
          sss_no: cloudRecord.sss_no,
          pag_ibig_no: cloudRecord.pag_ibig_no,
          philhealth_no: cloudRecord.philhealth_no,
          tin_no: cloudRecord.tin_no,
          contact_person: cloudRecord.contact_person,
          contact_person_number: cloudRecord.contact_person_number,
          contact_person_address: cloudRecord.contact_person_address,
          address2: cloudRecord.address2,
          contact_person_address2: cloudRecord.contact_person_address2,
          date_expire: cloudRecord.date_expire,
          profile_picture: cloudRecord.profile_picture,
          signature: cloudRecord.signature,
        },
        { where: { employee_id: employeeId } }
      );
      console.log(`Updated record for employee_id: ${employeeId}`);
    } else {
      // Step 4: Insert a new record
      await IdInformationLocal.create({
        employee_id: cloudRecord.employee_id,
        first_name: cloudRecord.first_name,
        middle_name: cloudRecord.middle_name,
        last_name: cloudRecord.last_name,
        affix: cloudRecord.affix,
        type_of_employee: cloudRecord.type_of_employee,
        designation: cloudRecord.designation,
        url: cloudRecord.url,
        birthday: cloudRecord.birthday,
        contact_number: cloudRecord.contact_number,
        address: cloudRecord.address,
        sss_no: cloudRecord.sss_no,
        pag_ibig_no: cloudRecord.pag_ibig_no,
        philhealth_no: cloudRecord.philhealth_no,
        tin_no: cloudRecord.tin_no,
        contact_person: cloudRecord.contact_person,
        contact_person_number: cloudRecord.contact_person_number,
        contact_person_address: cloudRecord.contact_person_address,
        address2: cloudRecord.address2,
        contact_person_address2: cloudRecord.contact_person_address2,
        date_expire: cloudRecord.date_expire,
        profile_picture: cloudRecord.profile_picture,
        signature: cloudRecord.signature,
      });
      console.log(`Inserted new record for employee_id: ${employeeId}`);
    }

    console.log(`Synchronization complete for employee_id: ${employeeId}`);
  } catch (error) {
    console.error(`Error syncing employee_id: ${employeeId}`, error);
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
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
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
// cron.schedule("0 21 * * *", async () => {
//   console.log("Running syncIdInformationToLocal at 9 PM");
//   await syncIdInformationToLocal();
// });

// Sync ViolationList and Violation at 5 AM, 1 PM, 4 PM, and 5 PM every day
// cron.schedule("0 5,13,16,17 * * *", async () => {
//   console.log("Running syncViolationListToLocal and syncViolationToLocal");
//   await syncViolationListToLocal();
//   await syncViolationToLocal();
// });

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
  syncIdInformationToLocal,
  syncSpecificEmployeeToLocal,
};
