"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material"
import { CheckCircle, Warning } from "@mui/icons-material"

const VerificationModal = ({ open, onClose, onConfirm, formData }) => {
  const [verifications, setVerifications] = useState({
    customerDetails: false,
    vehicleNumber: false,
    cropInformation: false,
    weightCalculation: false,
    finalAmount: false,
    voucherNumber: false,
    adminApproval: false,
  })

  const handleVerificationChange = (field) => {
    setVerifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const allVerified = Object.values(verifications).every(Boolean)

  const handleConfirm = () => {
    if (allVerified) {
      onConfirm()
      // Reset verifications for next time
      setVerifications({
        customerDetails: false,
        vehicleNumber: false,
        cropInformation: false,
        weightCalculation: false,
        finalAmount: false,
        voucherNumber: false,
        adminApproval: false,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Warning />
        Admin Verification Required
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please verify all details below before creating the receipt. All checkboxes must be checked to proceed.
        </Alert>

        {/* Customer Details Verification */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Customer Information
          </Typography>
          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
            <Typography>
              <strong>Name:</strong> {formData.name}
            </Typography>
            <Typography>
              <strong>Address:</strong> {formData.address}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {formData.phoneNo}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.customerDetails}
                onChange={() => handleVerificationChange("customerDetails")}
                color="primary"
              />
            }
            label="I have verified the customer details are correct"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Vehicle Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Vehicle Information
          </Typography>
          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
            <Typography>
              <strong>Vehicle Number:</strong> {formData.truckNo}
            </Typography>
            <Typography>
              <strong>Weight Type:</strong> {formData.weightType}
            </Typography>
            <Typography>
              <strong>Sale Type:</strong> {formData.saleType}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.vehicleNumber}
                onChange={() => handleVerificationChange("vehicleNumber")}
                color="primary"
              />
            }
            label="I have verified the vehicle information is accurate"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Crop Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Crop Information
          </Typography>
          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
            <Typography>
              <strong>Crop Name:</strong> {formData.cropName}
            </Typography>
            <Typography>
              <strong>Voucher Number:</strong> {formData.parchiNo}
            </Typography>
            <Typography>
              <strong>Varieties:</strong>
            </Typography>
            {formData.varieties.map((variety, index) => (
              <Box key={index} sx={{ ml: 2, mt: 1 }}>
                <Typography variant="body2">
                  • {variety.variety} - Qty: {variety.quantity}, Rate: ₹{variety.rate}, Amount: ₹{variety.amount}
                </Typography>
              </Box>
            ))}
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.cropInformation}
                onChange={() => handleVerificationChange("cropInformation")}
                color="primary"
              />
            }
            label="I have verified the crop information and varieties are correct"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Weight and Amount Verification */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Weight & Amount Calculation
          </Typography>
          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
            <Typography>
              <strong>Number of Bags:</strong> {formData.noOfBags}
            </Typography>
            <Typography>
              <strong>Net Weight:</strong> {formData.netWeight} kg
            </Typography>
            <Typography>
              <strong>Final Amount:</strong> ₹{formData.finalAmount}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.weightCalculation}
                onChange={() => handleVerificationChange("weightCalculation")}
                color="primary"
              />
            }
            label="I have verified the weight calculations are accurate"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Final Amount Verification */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.finalAmount}
                onChange={() => handleVerificationChange("finalAmount")}
                color="primary"
              />
            }
            label={`I confirm the final amount of ₹${formData.finalAmount} is correct`}
          />
        </Box>

        {/* Voucher Number Verification */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.voucherNumber}
                onChange={() => handleVerificationChange("voucherNumber")}
                color="primary"
              />
            }
            label={`I have verified voucher number ${formData.parchiNo} is unique and valid`}
          />
        </Box>

        {/* Admin Approval */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={verifications.adminApproval}
                onChange={() => handleVerificationChange("adminApproval")}
                color="error"
              />
            }
            label="As an admin, I approve the creation of this receipt with the above details"
          />
        </Box>

        {!allVerified && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please check all verification boxes to proceed with receipt creation.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!allVerified}
          startIcon={<CheckCircle />}
          size="large"
          sx={{
            bgcolor: allVerified ? "success.main" : "grey.400",
            "&:hover": {
              bgcolor: allVerified ? "success.dark" : "grey.400",
            },
          }}
        >
          Create Receipt
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VerificationModal
