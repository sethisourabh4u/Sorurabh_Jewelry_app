/*
  --- INSTRUCTIONS FOR APP OWNER: How to Enable Email Notifications ---

  To receive an email at 'sethisourabh@gmail.com' for every new activation,
  you need to update the server-side script that powers your activation system.
  This is the most secure and reliable method.

  Please follow these steps carefully:

  1. Open your "Jewelry App Activations" Google Sheet.

  2. In the top menu, go to "Extensions" -> "Apps Script". This will open the
     script editor in a new tab.

  3. Delete all the code currently in the editor window (it should start with
     `function doPost(e)`).

  4. Copy the entire code block below (from `--- START OF SCRIPT ---` to
     `--- END OF SCRIPT ---`) and paste it into the empty editor window.

  5. Click the "Save project" icon (it looks like a floppy disk).

  6. Click the blue "Deploy" button and select "Manage deployments".

  7. In the pop-up, find your active deployment and click the pencil icon (✎)
     to edit it.

  8. From the "Version" dropdown, select "New version". You can leave the
     description blank.

  9. Click the "Deploy" button at the bottom. You will likely be asked to 
     re-authorize the script. This is normal, as you are granting it a new
     permission: the ability to send emails on your behalf. Follow the prompts 
     to allow access.

  10. That's it! Your Web App URL remains the same. The next time a user
      activates the app, an email will be sent to sethisourabh@gmail.com.

  --- START OF SCRIPT ---
  function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000); // Wait up to 30 seconds for other processes to finish.

    try {
      // Assumes your data is in the first sheet. Change "Sheet1" if you renamed it.
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); 
      
      var data = JSON.parse(e.postData.contents);
      var keyCode = data.code.trim().toUpperCase();
      
      // Find the keyCode in the sheet (Column B)
      var textFinder = sheet.getRange("B:B").createTextFinder(keyCode);
      var searchResults = textFinder.findAll();
      
      if (searchResults.length > 0) {
        // Key is already used
        return ContentService
          .createTextOutput(JSON.stringify({ status: 'error', message: 'This activation code has already been used.' }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        // Key is new, so add it to the sheet
        var now = new Date();
        var newRow = [
          now,
          keyCode,
          data.name,
          data.company,
          data.mobile
        ];
        sheet.appendRow(newRow);

        // Send email notification
        try {
          var recipient = 'sethisourabh@gmail.com';
          var subject = 'New Jewelry App Activation: ' + data.company;
          var body = 'A new user has activated the Jewelry Order Creator app.\n\n' +
                     'Name: ' + data.name + '\n' +
                     'Company: ' + data.company + '\n' +
                     'Mobile: ' + data.mobile + '\n' +
                     'Activation Code Used: ' + keyCode + '\n\n' +
                     'Timestamp: ' + now.toLocaleString('en-US');
          
          MailApp.sendEmail(recipient, subject, body);
        } catch (emailError) {
          // Log the error but don't fail the activation for the user
          console.error("Failed to send activation email: " + emailError.toString());
        }
        
        return ContentService
          .createTextOutput(JSON.stringify({ status: 'success', message: 'Activation successful.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'An unexpected server error occurred: ' + error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    } finally {
      lock.releaseLock();
    }
  }
  --- END OF SCRIPT ---
*/

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { KeyIcon } from './icons/KeyIcon';
import type { UserDetails } from '../types';


// ************************************************************************************
// *                                                                                  *
// *   !!! CRITICAL CONFIGURATION REQUIRED !!!                                        *
// *                                                                                  *
// *   The app is not connected to your activation server.                            *
// *   You MUST replace the placeholder text below with your own Google Apps Script   *
// *   Web App URL. It is crucial that you paste the URL *inside* the single quotes.  *
// *                                                                                  *
// *   A correct URL looks like: https://script.google.com/macros/s/..../exec         *
// *                                                                                  *
// ************************************************************************************
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyG_eRBafhbGsLdJztiQLHAWIValWnv6TaIVSttmLnbjipPf4NT5ScZICvSGx0yhhvc/exec'; // <-- PASTE YOUR URL INSIDE THE QUOTES

// --- List of Valid Activation Codes ---
// This list now acts as a pre-check to ensure the code format is valid before contacting the server.
const VALID_CODES = new Set([
  'FVC-7K9D-23LM-8QWZ', 'FVC-A4P7-DF38-XK2J', 'FVC-ZQ1L-90XM-5B8V',
  'FVC-R2N8-7L4K-JM3C', 'FVC-H1K7-52QZ-N8X9', 'FVC-3V9M-L5Q2-7DHF',
  'FVC-X5C3-2Q8M-9RKT', 'FVC-N8W7-4ZP3-H6LQ', 'FVC-2L7J-3K9V-Q8MH',
  'FVC-Y6P2-M8X5-4DQN', 'FVC-8J2H-5Q9L-X3KV', 'FVC-1R9N-7L3C-M5XP',
  'FVC-Q3K8-V9W2-4J6H', 'FVC-K2M7-8P4N-1ZQX', 'FVC-5H9J-2X8L-7MWC',
  'FVC-4P2M-Q7L8-9K1V', 'FVC-L7K3-5N8H-2QMW', 'FVC-M9P2-4K7X-H1QJ',
  'FVC-7X3C-2M9Q-5PLN', 'FVC-P5Q8-K9H2-7XLM', 'FVC-9R2M-7J4X-Q5LC',
  'FVC-6K1N-9P7L-M4QV', 'FVC-X9M2-5P7K-1QLJ', 'FVC-2Q7H-8X9M-3LKP',
  'FVC-V3P9-7K4M-2QXH', 'FVC-1K7L-9M2Q-P8XH', 'FVC-Q9P2-3L7X-5KMN',
  'FVC-7L4Q-9X2M-1KPC', 'FVC-M8K2-7L5P-9QXH', 'FVC-3Q9K-2X7L-M5PN',
  'FVC-P8M2-1L9Q-7KXC', 'FVC-4M7Q-9L2X-K1PH', 'FVC-L9Q2-3M7K-P8XH',
  'FVC-5K2M-9Q8L-7XHC', 'FVC-M2L9-7K5Q-1PXH', 'FVC-9Q7L-2M8K-P5XC',
  'FVC-7M9Q-1L2K-X5PC', 'FVC-2K7M-9L3Q-5XPH', 'FVC-L2Q9-7M5K-8XPC'
]);
// ------------------------------------

/**
 * A wrapper around fetch that adds a timeout.
 * @param resource The URL to fetch.
 * @param options Fetch options.
 * @param timeout Timeout in milliseconds.
 * @returns A Promise that resolves with the Response.
 */
const fetchWithTimeout = async (
  resource: RequestInfo,
  options: RequestInit = {},
  timeout: number = 20000 // 20 seconds
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};


const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            id={id}
            {...props}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50"
        />
    </div>
);

interface ActivationScreenProps {
  onActivationSuccess: (details: UserDetails) => void;
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({ onActivationSuccess }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue += value.substring(0, 3);
    }
    if (value.length > 3) {
      formattedValue += '-' + value.substring(3, 7);
    }
    if (value.length > 7) {
      formattedValue += '-' + value.substring(7, 11);
    }
    if (value.length > 11) {
      formattedValue += '-' + value.substring(11, 15);
    }
    setCode(formattedValue);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!name || !company || !mobile || !code) {
        setError('All fields are required.');
        setIsLoading(false);
        return;
    }

    // This is the corrected, more robust check for the placeholder URL.
    if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
        setError('CRITICAL: App not configured. The developer must edit the ActivationScreen.tsx file and set the SCRIPT_URL variable.');
        setIsLoading(false);
        return;
    }

    const enteredCode = code.trim().toUpperCase();

    // 1. Client-side check for valid code format.
    if (!VALID_CODES.has(enteredCode)) {
      setError('Invalid activation code. Please check the code and try again.');
      setIsLoading(false);
      return;
    }

    // 2. Server-side check to see if the code has been used, now with timeout.
    try {
        const response = await fetchWithTimeout(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ 
                code: enteredCode, 
                name: name.trim(), 
                company: company.trim(), 
                mobile: mobile.trim() 
            }),
        });
        
        const result = await response.json();

        if (result.status === 'success') {
            const userDetails = { name: name.trim(), company: company.trim(), mobile: mobile.trim() };
            // The record is now saved securely in the Google Sheet.
            onActivationSuccess(userDetails);
        } else {
            setError(result.message || 'Activation failed. Please try again.');
        }

    } catch (err: any) {
        console.error("Activation request failed", err);
        if (err.name === 'AbortError') {
            setError('The activation server is not responding. Please check your internet connection and try again.');
        } else {
            setError('Could not connect to the activation server. An unknown error occurred.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                Jewelry Order Creator
            </h1>
            <p className="text-gray-400 mt-2">
                Activate Your App
            </p>
        </header>

        <Card>
          <form onSubmit={handleActivate} className="space-y-4">
            <FormInput label="Your Name" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
            <FormInput label="Company Name" id="company" type="text" value={company} onChange={e => setCompany(e.target.value)} required disabled={isLoading} />
            <FormInput label="Mobile Number" id="mobile" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required disabled={isLoading} />
            
            <div>
              <label htmlFor="activation-code" className="block text-sm font-medium text-gray-300 mb-1">
                Activation Code
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyIcon />
                </div>
                <input
                  id="activation-code" type="text" value={code} onChange={handleCodeChange}
                  placeholder="e.g., FVC-XXXX-XXXX-XXXX"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  required disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait">
              {isLoading ? 'Activating...' : 'Activate'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};