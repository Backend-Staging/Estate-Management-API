from django.core.management.base import BaseCommand

from core_apps.ai_assistant.models import PropertyKnowledgeArticle

DEFAULT_ARTICLES = [
    {
        "slug": "washer-installation",
        "title": "Installing a washer or dryer",
        "category": PropertyKnowledgeArticle.Category.LEASE,
        "content": (
            "Residents may install a portable washer only with written approval from "
            "building management. Full-size washer/dryer installations require an "
            "in-unit plumbing inspection, noise compliance review, and a signed "
            "alteration addendum. Contact the office before purchasing appliances."
        ),
    },
    {
        "slug": "maintenance-emergency",
        "title": "Maintenance emergencies",
        "category": PropertyKnowledgeArticle.Category.EMERGENCY,
        "content": (
            "For fire, gas odor, major flooding, or immediate danger, call 911 first. "
            "Then contact building emergency maintenance through the app or the "
            "24-hour emergency line. Non-emergency issues should be submitted as "
            "maintenance requests with photos when possible."
        ),
    },
    {
        "slug": "water-damage-reporting",
        "title": "Reporting water damage",
        "category": PropertyKnowledgeArticle.Category.MAINTENANCE,
        "content": (
            "If you discover water damage, shut off the nearest water source if safe, "
            "move belongings away from the leak, and submit a maintenance request "
            "immediately. Include the unit number, location of the leak, and photos. "
            "For active flooding affecting multiple units, call the emergency line."
        ),
    },
    {
        "slug": "ac-outage",
        "title": "Air conditioning outages",
        "category": PropertyKnowledgeArticle.Category.MAINTENANCE,
        "content": (
            "During business hours, submit a maintenance request with your thermostat "
            "settings and any error codes. After hours, use emergency maintenance only "
            "if the outage affects vulnerable residents or extreme heat conditions."
        ),
    },
    {
        "slug": "quiet-hours",
        "title": "Quiet hours and neighbor conduct",
        "category": PropertyKnowledgeArticle.Category.POLICY,
        "content": (
            "Quiet hours are 10:00 PM to 8:00 AM daily. Excessive noise, smoking in "
            "non-designated areas, and unsafe common-area behavior may result in "
            "warnings. Use the community board for neighbor coordination and the "
            "concern report form for ongoing issues."
        ),
    },
    {
        "slug": "pest-control",
        "title": "Pest control requests",
        "category": PropertyKnowledgeArticle.Category.MAINTENANCE,
        "content": (
            "Report pest sightings through a maintenance request with the location and "
            "type of pest. Building-wide treatments are scheduled quarterly. Residents "
            "should prepare units according to vendor instructions when notified."
        ),
    },
]


class Command(BaseCommand):
    help = "Seed default property knowledge articles for the RAG assistant"

    def handle(self, *args, **options):
        created = 0
        for article in DEFAULT_ARTICLES:
            _, was_created = PropertyKnowledgeArticle.objects.update_or_create(
                slug=article["slug"],
                defaults={
                    "title": article["title"],
                    "category": article["category"],
                    "content": article["content"],
                    "is_active": True,
                },
            )
            if was_created:
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Knowledge base ready ({created} created, "
                f"{len(DEFAULT_ARTICLES) - created} updated)."
            )
        )
