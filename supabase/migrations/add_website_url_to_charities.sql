-- Add website_url column to charities table
ALTER TABLE charities
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN charities.website_url IS 'Official website URL of the charity';
