/*
  Content Scheduler Service
  Purpose: Handles automated scheduling and status updates for banners and collections
  Features: Auto-publish scheduled content, expire time-limited content, status management
*/

const cron = require('node-cron');
const HeroBanner = require('../models/HeroBanner');
const FeaturedCollection = require('../models/FeaturedCollection');

class ContentScheduler {
  constructor() {
    this.isRunning = false;
    this.cronJob = null;
  }

  // Start the content scheduler
  start() {
    if (this.isRunning) {
      console.log('⚠️ Content scheduler is already running');
      return;
    }

    // Run every minute to check for scheduled content
    this.cronJob = cron.schedule('* * * * *', async () => {
      await this.processScheduledContent();
    }, {
      scheduled: false
    });

    this.cronJob.start();
    this.isRunning = true;
    console.log('🕒 Content scheduler started - checking every minute');
  }

  // Stop the content scheduler
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log('⏹️ Content scheduler stopped');
  }

  // Process all scheduled content
  async processScheduledContent() {
    try {
      const now = new Date();
      const results = await Promise.all([
        this.activateScheduledBanners(now),
        this.expireBanners(now),
        this.activateScheduledCollections(now),
        this.expireCollections(now)
      ]);

      const [bannersActivated, bannersExpired, collectionsActivated, collectionsExpired] = results;
      const totalProcessed = bannersActivated + bannersExpired + collectionsActivated + collectionsExpired;

      if (totalProcessed > 0) {
        console.log(`📅 Content scheduler processed ${totalProcessed} items:`, {
          bannersActivated,
          bannersExpired,
          collectionsActivated,
          collectionsExpired
        });
      }
    } catch (error) {
      console.error('❌ Error in content scheduler:', error);
    }
  }

  // Activate scheduled banners that should now be published
  async activateScheduledBanners(now) {
    try {
      const result = await HeroBanner.updateMany(
        {
          status: 'scheduled',
          scheduledStart: { $lte: now },
          $or: [
            { scheduledEnd: { $exists: false } },
            { scheduledEnd: null },
            { scheduledEnd: { $gt: now } }
          ]
        },
        { 
          status: 'published',
          activatedAt: now
        }
      );
      
      return result.modifiedCount;
    } catch (error) {
      console.error('Error activating scheduled banners:', error);
      return 0;
    }
  }

  // Expire banners that have passed their end time
  async expireBanners(now) {
    try {
      const result = await HeroBanner.updateMany(
        {
          status: { $in: ['published', 'scheduled'] },
          scheduledEnd: { $lt: now }
        },
        { 
          status: 'expired',
          expiredAt: now
        }
      );
      
      return result.modifiedCount;
    } catch (error) {
      console.error('Error expiring banners:', error);
      return 0;
    }
  }

  // Activate scheduled collections that should now be published
  async activateScheduledCollections(now) {
    try {
      const result = await FeaturedCollection.updateMany(
        {
          status: 'scheduled',
          scheduledStart: { $lte: now },
          $or: [
            { scheduledEnd: { $exists: false } },
            { scheduledEnd: null },
            { scheduledEnd: { $gt: now } }
          ]
        },
        { 
          status: 'published',
          activatedAt: now
        }
      );
      
      return result.modifiedCount;
    } catch (error) {
      console.error('Error activating scheduled collections:', error);
      return 0;
    }
  }

  // Expire collections that have passed their end time
  async expireCollections(now) {
    try {
      const result = await FeaturedCollection.updateMany(
        {
          status: { $in: ['published', 'scheduled'] },
          scheduledEnd: { $lt: now }
        },
        { 
          status: 'expired',
          expiredAt: now
        }
      );
      
      return result.modifiedCount;
    } catch (error) {
      console.error('Error expiring collections:', error);
      return 0;
    }
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.cronJob ? this.cronJob.nextDate() : null
    };
  }

  // Manual trigger for scheduled content processing
  async runNow() {
    console.log('🔄 Manually triggering content scheduler...');
    await this.processScheduledContent();
  }

  // Get upcoming scheduled content
  async getUpcomingScheduled() {
    try {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const [upcomingBanners, upcomingCollections] = await Promise.all([
        HeroBanner.find({
          status: 'scheduled',
          scheduledStart: { $gte: now, $lte: nextWeek }
        }).sort({ scheduledStart: 1 }),
        
        FeaturedCollection.find({
          status: 'scheduled',
          scheduledStart: { $gte: now, $lte: nextWeek }
        }).sort({ scheduledStart: 1 })
      ]);

      return {
        banners: upcomingBanners,
        collections: upcomingCollections,
        total: upcomingBanners.length + upcomingCollections.length
      };
    } catch (error) {
      console.error('Error getting upcoming scheduled content:', error);
      return { banners: [], collections: [], total: 0 };
    }
  }
}

// Create singleton instance
const contentScheduler = new ContentScheduler();

module.exports = contentScheduler;