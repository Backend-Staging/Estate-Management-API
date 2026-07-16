import uuid
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.db import IntegrityError

User = get_user_model()


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    ``created_at`` and ``updated_at`` fields. Also implements
    ``pkid`` and a ``id`` fields the id field wll leverage
    the uuid4() function to generate a unique id.
    """
    
    pkid = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ["-created_at", "-updated_at"]
        
        
class ContentView(TimeStampedModel):
    """
    A model that represents a view of a content.
    """
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField(verbose_name=_("Object ID"))
    content_object = GenericForeignKey("content_type", "object_id")
    
    user = models.ForeignKey(User, 
                             on_delete=models.SET_NULL,
                               null=True,
                               blank=True,
                               verbose_name=_("User"))
    
    viewer_ip = models.GenericIPAddressField(
        verbose_name=_("Viewer IP Address"), 
        null=True,
        blank=True,
        protocol="both",
        unpack_ipv4=False,
    )
    
    last_viewed = models.DateTimeField(verbose_name=_("Last viewed at"), 
                                       null=True,
                                       blank=True)
    
    class Meta:
        verbose_name = _("Content View")
        verbose_name_plural = _("Content Views")
        unique_together = ["content_type", "object_id", "user", "viewer_ip"]

    def __str__(self) -> str:
        return f"{self.content_object} viewed by {self.user.get_full_name if self.user else 'Anonymous'} from IP {self.viewer_ip}"

    @classmethod
    def record_view(cls, content_object, user: User, viewer_ip: str) -> None:
        """Records a view of a content object by a user from a specific IP address."""
        content_type = ContentType.objects.get_for_model(content_object)
        try:
            view, created = cls.objects.get_or_create(
                content_type=content_type,
                object_id=content_object.pkid,
                defaults={"user": user, "viewer_ip": viewer_ip},
            )
            if not created:
                pass
        except IntegrityError:
            pass
