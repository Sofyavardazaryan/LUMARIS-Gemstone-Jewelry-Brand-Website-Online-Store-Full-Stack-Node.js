import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AccountPage.css';

const AccountPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
      setEditing(false);
    } catch { toast.error('Could not update profile'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Could not change password'); }
    finally { setPwLoading(false); }
  };

  return (
    <div className="account-page">
      {/* Sidebar */}
      <div className="account-sidebar">
        <div className="account-sidebar__avatar">
          <div className="account-sidebar__initials">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
          <div>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        <nav className="account-sidebar__nav">
          <Link to="/account" className="account-sidebar__link active">Profile</Link>
          <Link to="/account/orders" className="account-sidebar__link">Orders</Link>
          <Link to="/account/wishlist" className="account-sidebar__link">Wishlist</Link>
          <button className="account-sidebar__link account-sidebar__logout" onClick={logout}>Sign Out</button>
        </nav>
      </div>

      {/* Content */}
      <div className="account-content">
        {/* Profile Section */}
        <div className="account-card">
          <div className="account-card__header">
            <h2>Personal Information</h2>
            {!editing && <button className="btn btn-ghost" onClick={() => setEditing(true)}>Edit</button>}
          </div>

          {editing ? (
            <form onSubmit={handleProfileSave} className="account-profile-form">
              <div className="account-profile-form__row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" value={form.firstName} onChange={(e) => setForm(p => ({...p, firstName: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" value={form.lastName} onChange={(e) => setForm(p => ({...p, lastName: e.target.value}))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm(p => ({...p, phone: e.target.value}))} />
              </div>
              <div className="account-form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="account-profile-info">
              <div className="account-info-row"><span>Full Name</span><span>{user?.firstName} {user?.lastName}</span></div>
              <div className="account-info-row"><span>Email</span><span>{user?.email}</span></div>
              <div className="account-info-row"><span>Phone</span><span>{user?.phone || '—'}</span></div>
              <div className="account-info-row"><span>Member Since</span><span>{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span></div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="account-card">
          <div className="account-card__header">
            <h2>Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="account-password-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={pwForm.currentPassword} onChange={(e) => setPwForm(p => ({...p, currentPassword: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="Min. 6 characters" value={pwForm.newPassword} onChange={(e) => setPwForm(p => ({...p, newPassword: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={pwForm.confirmPassword} onChange={(e) => setPwForm(p => ({...p, confirmPassword: e.target.value}))} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
