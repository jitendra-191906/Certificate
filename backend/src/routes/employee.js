const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');

const router = express.Router();

// All employee routes will be protected
router.use(auth);

// Get all employees for the authenticated user
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Get single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Error fetching employee' });
  }
});

// Add new employee
router.post('/', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const employeeData = {
      ...req.body,
      userId: req.user.id,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : null
    };

    // Check if employee ID already exists for this user
    const existingEmployee = await Employee.findOne({ 
      employeeId: employeeData.employeeId, 
      userId: req.user.id 
    });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const employee = new Employee(employeeData);
    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee' });
  }
});

// Update employee
router.put('/:id', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const updateData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : null
    };

    // Check if employee ID already exists for another employee
    const existingEmployee = await Employee.findOne({ 
      employeeId: updateData.employeeId, 
      userId: req.user.id,
      _id: { $ne: req.params.id }
    });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

module.exports = router;
