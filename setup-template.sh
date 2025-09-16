#!/bin/bash
set -e

echo "🚀 Frontend Project Bootstrap & Setup"
echo "===================================="

# -----------------------------------------------------------------------------
# Step 1: Define paths
# -----------------------------------------------------------------------------
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DEFAULT_BASE_PATH="$(dirname "$SCRIPT_DIR")"

# Ask for target path
read -p "Enter the path for new project (leave empty for default: $DEFAULT_BASE_PATH): " CUSTOM_PATH
if [ -z "$CUSTOM_PATH" ]; then
  CUSTOM_PATH="$DEFAULT_BASE_PATH"
fi

# Convert Windows path "D:\any-project-check" -> "/d/any-project-check"
CUSTOM_PATH=$(echo "$CUSTOM_PATH" | sed -E 's#^([A-Za-z]):#/\L\1/#' | sed 's#\\#/#g')



# Ask for project name
read -p "Enter project name: " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
  PROJECT_NAME="new-template"
fi

TEMPLATE_BASE="$SCRIPT_DIR"
PROJECT_PATH="$CUSTOM_PATH/$PROJECT_NAME"

# -----------------------------------------------------------------------------
# Step 2: Copy template
# -----------------------------------------------------------------------------
echo "📂 Creating new project at $PROJECT_PATH..."
mkdir -p "$PROJECT_PATH"
# Copy everything except setup-template.sh and .env.example
cp -r "$TEMPLATE_BASE"/* "$PROJECT_PATH"/
rm -f "$PROJECT_PATH/setup-template.sh" "$PROJECT_PATH/.env.example"


cd "$PROJECT_PATH" || { echo "❌ Failed to enter $PROJECT_PATH"; exit 1; }

# -----------------------------------------------------------------------------
# Step 3: Run existing setup logic (your prompts, theme setup, etc.)
# -----------------------------------------------------------------------------


# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -n "$prompt [$default]: "
    read input
    if [ -z "$input" ]; then
        eval "$var_name='$default'"
    else
        eval "$var_name='$input'"
    fi
}

# Function to prompt for color
prompt_color() {
    local color_name="$1"
    local default_color="$2"
    local var_name="$3"
    
    echo -n "Enter $color_name color [$default_color]: "
    read input
    if [ -z "$input" ]; then
        eval "$var_name='$default_color'"
    else
        eval "$var_name='$input'"
    fi
}
# Get project details
echo "📝 Project Information"
echo "----------------------"
prompt_with_default "Project name" "My Awesome App" PROJECT_NAME
prompt_with_default "Project description" "A modern, dynamic application" PROJECT_DESCRIPTION
prompt_with_default "API Base URL" "http://192.168.0.108:8000" API_BASE_URL

prompt_with_default "RAZORPAY KEY ID" "rzp_test_zRB6kA1NHhW0rc" RAZORPAY_KEY_ID
prompt_with_default "RAZORPAY KEY SECRET" "pYFKFdtk8xaCBDlyL88KkDEk" RAZORPAY_KEY_SECRET
prompt_with_default "STRIPE PUBLISHABLE KEY" "pk_test_51Rzw7dITFZzvPAwge03aXMdQ2CR4TNR856vyshQvEgig5pMZSiNc1OhiCHQrrbNIimWwbMQNjGgOrNsZhFdYKGDR00Ds7ctEyt" STRIPE_PUBLISHABLE_KEY

prompt_with_default "API Key" "admin123" API_KEY


VITE_RAZORPAY_KEY_ID=rzp_test_zRB6kA1NHhW0rc
VITE_RAZORPAY_KEY_SECRET=pYFKFdtk8xaCBDlyL88KkDEk
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Rzw7dITFZzvPAwge03aXMdQ2CR4TNR856vyshQvEgig5pMZSiNc1OhiCHQrrbNIimWwbMQNjGgOrNsZhFdYKGDR00Ds7ctEyt

echo ""
echo "🎨 Theme Configuration"
echo "----------------------"
echo "Choose a color theme:"
echo "1. Blue & Green (Default)"
echo "2. Purple & Pink"
echo "3. Orange & Red"
echo "4. Custom colors"
echo -n "Select theme [1]: "
read theme_choice

case $theme_choice in
    2)
        # Purple & Pink theme
        PRIMARY_500="#8b5cf6"
        PRIMARY_600="#7c3aed"
        SECONDARY_500="#ec4899"
        SECONDARY_600="#db2777"
        ACCENT_500="#f59e0b"
        ACCENT_600="#d97706"
        ;;
    3)
        # Orange & Red theme
        PRIMARY_500="#f97316"
        PRIMARY_600="#ea580c"
        SECONDARY_500="#ef4444"
        SECONDARY_600="#dc2626"
        ACCENT_500="#eab308"
        ACCENT_600="#ca8a04"
        ;;
    4)
        # Custom colors
        echo "Enter custom colors (hex format, e.g., #0ea5e9):"
        prompt_color "Primary" "#0ea5e9" PRIMARY_500
        prompt_color "Primary Dark" "#0284c7" PRIMARY_600
        prompt_color "Secondary" "#22c55e" SECONDARY_500
        prompt_color "Secondary Dark" "#16a34a" SECONDARY_600
        prompt_color "Accent" "#f59e0b" ACCENT_500
        prompt_color "Accent Dark" "#d97706" ACCENT_600
        ;;
    *)
        # Default Blue & Green theme
        PRIMARY_500="#0ea5e9"
        PRIMARY_600="#0284c7"
        SECONDARY_500="#22c55e"
        SECONDARY_600="#16a34a"
        ACCENT_500="#f59e0b"
        ACCENT_600="#d97706"
        ;;
esac

echo ""
echo "⚙️  Creating configuration..."

# Create .env file
cat > .env << EOF
# Project Configuration
VITE_PROJECT_NAME=$PROJECT_NAME
VITE_PROJECT_DESCRIPTION=$PROJECT_DESCRIPTION

# API Configuration
VITE_API_BASE_URL=$API_BASE_URL
VITE_API_KEY=$API_KEY

VITE_RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
VITE_RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET
VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY

# Theme Colors - Primary
VITE_PRIMARY_50=#f0f9ff
VITE_PRIMARY_100=#e0f2fe
VITE_PRIMARY_200=#bae6fd
VITE_PRIMARY_300=#7dd3fc
VITE_PRIMARY_400=#38bdf8
VITE_PRIMARY_500=$PRIMARY_500
VITE_PRIMARY_600=$PRIMARY_600
VITE_PRIMARY_700=#0369a1
VITE_PRIMARY_800=#075985
VITE_PRIMARY_900=#0c4a6e

# Theme Colors - Secondary
VITE_SECONDARY_50=#f0fdf4
VITE_SECONDARY_100=#dcfce7
VITE_SECONDARY_200=#bbf7d0
VITE_SECONDARY_300=#86efac
VITE_SECONDARY_400=#4ade80
VITE_SECONDARY_500=$SECONDARY_500
VITE_SECONDARY_600=$SECONDARY_600
VITE_SECONDARY_700=#15803d
VITE_SECONDARY_800=#166534
VITE_SECONDARY_900=#14532d

# Theme Colors - Accent
VITE_ACCENT_50=#fffbeb
VITE_ACCENT_100=#fef3c7
VITE_ACCENT_200=#fde68a
VITE_ACCENT_300=#fcd34d
VITE_ACCENT_400=#fbbf24
VITE_ACCENT_500=$ACCENT_500
VITE_ACCENT_600=$ACCENT_600
VITE_ACCENT_700=#b45309
VITE_ACCENT_800=#92400e
VITE_ACCENT_900=#78350f

# Theme Gradients
VITE_GRADIENT_PRIMARY=linear-gradient(135deg, $PRIMARY_500 0%, $PRIMARY_600 100%)
VITE_GRADIENT_SECONDARY=linear-gradient(135deg, $SECONDARY_500 0%, $SECONDARY_600 100%)
VITE_GRADIENT_ACCENT=linear-gradient(135deg, $ACCENT_500 0%, $ACCENT_600 100%)
VITE_GRADIENT_RAINBOW=linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)

# Development Settings
VITE_HTTPS=false
VITE_DEV_HOST=false
EOF

# Update package.json name
PROJECT_SLUG=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

if command -v jq &> /dev/null; then
    jq --arg name "$PROJECT_SLUG" '.name = $name' package.json > package.json.tmp && mv package.json.tmp package.json
    echo "✅ Updated package.json name to: $PROJECT_SLUG"
else
    # Use sed to replace the first "name" field in package.json
    sed -i.bak "s/\"name\": \".*\"/\"name\": \"$PROJECT_SLUG\"/" package.json
    rm -f package.json.bak
    echo "✅ Updated package.json name to: $PROJECT_SLUG (via sed)"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "Project: $PROJECT_NAME"
echo "Description: $PROJECT_DESCRIPTION"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "🎨 To change colors later:"
echo "   Edit the .env file and restart the dev server"
echo ""
echo "📁 Your project is ready to use!"