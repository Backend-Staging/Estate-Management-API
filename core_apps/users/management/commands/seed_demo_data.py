from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from core_apps.apartments.models import Apartment
from core_apps.issues.models import Issue
from core_apps.posts.models import Post
from core_apps.profiles.models import Profile

User = get_user_model()

BUILDINGS = ["North Tower", "South Tower", "East Wing"]
DEFAULT_PASSWORD = "Demo123!"

REPAIR_STAFF = [
    ("repair01", "Alex", "Rivera", "plumber", "North Tower"),
    ("repair02", "Jordan", "Lee", "electrician", "North Tower"),
    ("repair03", "Sam", "Nguyen", "hvac", "North Tower"),
    ("repair04", "Casey", "Brooks", "painter", "South Tower"),
    ("repair05", "Riley", "Chen", "carpenter", "South Tower"),
    ("repair06", "Morgan", "Patel", "mason", "South Tower"),
    ("repair07", "Taylor", "Kim", "roofer", "East Wing"),
    ("repair08", "Jamie", "Davis", "plumber", "East Wing"),
    ("repair09", "Quinn", "Martinez", "electrician", "East Wing"),
    ("repair10", "Avery", "Wilson", "hvac", "East Wing"),
]

POST_TITLES = [
    "Community BBQ this Saturday",
    "Selling a gently used couch",
    "Lost keys in the lobby",
    "Building Wi-Fi upgrade notice",
    "Looking for a pet sitter",
    "Holiday decoration guidelines",
    "Free moving boxes available",
    "Noise complaint follow-up",
    "Garage sale this weekend",
    "Welcome new neighbors",
]

ISSUE_TITLES = [
    "Kitchen sink is leaking",
    "Bedroom AC not cooling",
    "Bathroom light flickering",
    "Front door lock sticking",
    "Water pressure is low",
    "Heater making loud noise",
    "Window won't close fully",
    "Garbage disposal jammed",
]


class Command(BaseCommand):
    help = "Seed demo users, apartments, maintenance staff, posts, and issues."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete previously seeded demo accounts before re-seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["reset"]:
            self._reset_demo_data()

        admin = self._create_admin()
        tenants = self._create_tenants(admin)
        repair_users = self._create_repair_staff(admin)
        apartments = self._create_apartments(admin, tenants)
        self._create_posts(tenants, apartments)
        self._create_issues(tenants, apartments, repair_users)

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
        self.stdout.write("")
        self.stdout.write("Admin / agent portal login:")
        self.stdout.write("  Email:    admin@cybersys.com")
        self.stdout.write(f"  Password: {DEFAULT_PASSWORD}")
        self.stdout.write("  Portal:   http://localhost:8080/agent/dashboard")
        self.stdout.write("")
        self.stdout.write("Sample tenant logins:")
        self.stdout.write("  tenant01@cybersys.com … tenant25@cybersys.com")
        self.stdout.write(f"  Password: {DEFAULT_PASSWORD}")
        self.stdout.write("")
        self.stdout.write("Sample maintenance logins:")
        self.stdout.write("  repair01@cybersys.com … repair10@cybersys.com")
        self.stdout.write(f"  Password: {DEFAULT_PASSWORD}")

    def _reset_demo_data(self):
        demo_emails = ["admin@cybersys.com"] + [
            f"tenant{n:02d}@cybersys.com" for n in range(1, 26)
        ] + [f"repair{n:02d}@cybersys.com" for n in range(1, 11)]
        User.objects.filter(email__in=demo_emails).delete()
        self.stdout.write("Removed existing demo users.")

    def _create_admin(self) -> User:
        user, created = User.objects.get_or_create(
            email="admin@cybersys.com",
            defaults={
                "username": "admin",
                "first_name": "Building",
                "last_name": "Admin",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            user.set_password(DEFAULT_PASSWORD)
            user.save()
        profile = user.profile
        profile.role = Profile.Role.AGENT
        profile.save(update_fields=["role", "updated_at"])
        return user

    def _create_tenants(self, admin: User) -> list[User]:
        tenants: list[User] = []
        for index in range(1, 26):
            email = f"tenant{index:02d}@cybersys.com"
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": f"tenant{index:02d}",
                    "first_name": f"Tenant{index:02d}",
                    "last_name": "Resident",
                },
            )
            if created:
                user.set_password(DEFAULT_PASSWORD)
                user.save()
            profile = user.profile
            profile.role = Profile.Role.TENANT
            profile.occupation = Profile.Occupation.TENANT
            profile.save(update_fields=["role", "occupation", "updated_at"])
            tenants.append(user)
        return tenants

    def _create_repair_staff(self, admin: User) -> list[User]:
        repair_users: list[User] = []
        for username, first, last, occupation, building in REPAIR_STAFF:
            email = f"{username}@cybersys.com"
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": username,
                    "first_name": first,
                    "last_name": last,
                },
            )
            if created:
                user.set_password(DEFAULT_PASSWORD)
                user.save()
            profile = user.profile
            profile.role = Profile.Role.REPAIR
            profile.occupation = occupation
            profile.managed_by_agent = admin
            profile.assigned_building = building
            profile.save(
                update_fields=[
                    "role",
                    "occupation",
                    "managed_by_agent",
                    "assigned_building",
                    "updated_at",
                ]
            )
            repair_users.append(user)
        return repair_users

    def _create_apartments(self, admin: User, tenants: list[User]) -> list[Apartment]:
        apartments: list[Apartment] = []
        verified_at = timezone.now()
        for index, tenant in enumerate(tenants, start=1):
            building = BUILDINGS[(index - 1) % len(BUILDINGS)]
            floor = ((index - 1) % 10) + 1
            unit_number = f"{building[:1]}{index:03d}"
            apartment, _ = Apartment.objects.update_or_create(
                unit_number=unit_number,
                defaults={
                    "building": building,
                    "floor": floor,
                    "managed_by": admin,
                    "tenant": tenant,
                    "tenant_verified_at": verified_at,
                },
            )
            apartments.append(apartment)
        return apartments

    def _create_posts(self, tenants: list[User], apartments: list[Apartment]):
        for index, tenant in enumerate(tenants[: len(POST_TITLES)]):
            building = apartments[index].building
            title = POST_TITLES[index]
            post, created = Post.objects.get_or_create(
                title=title,
                author=tenant,
                defaults={
                    "body": f"This is a community post for {building}. Neighbors can reply here.",
                    "building": building,
                },
            )
            if created:
                post.tags.set(["community", building.split()[0].lower()])

    def _create_issues(
        self,
        tenants: list[User],
        apartments: list[Apartment],
        repair_users: list[User],
    ):
        repair_by_building: dict[str, list[User]] = {}
        for user in repair_users:
            building = user.profile.assigned_building
            repair_by_building.setdefault(building, []).append(user)

        for index, tenant in enumerate(tenants[: len(ISSUE_TITLES)]):
            apartment = apartments[index]
            building = apartment.building
            repair_pool = repair_by_building.get(building, [])
            assigned = repair_pool[index % len(repair_pool)] if repair_pool else None
            Issue.objects.get_or_create(
                title=ISSUE_TITLES[index],
                apartment=apartment,
                reported_by=tenant,
                defaults={
                    "description": f"Maintenance request from unit {apartment.unit_number}.",
                    "status": Issue.IssueStatus.REPORTED
                    if index % 2 == 0
                    else Issue.IssueStatus.IN_PROGRESS,
                    "priority": Issue.Priority.MEDIUM,
                    "assigned_to": assigned,
                },
            )
